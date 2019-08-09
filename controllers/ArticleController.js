import models from '../database/models';
import ServerResponse from '../modules/ServerResponse';
import ArticleHelper from '../helpers/ArticleHelper';
import pagination from '../helpers/Pagination';
import Notification from '../helpers/Notification';
import ShareArticle from '../helpers/ShareArticle';

const {
  Article, User, Profile, Report, Sequelize: { Op }, Bookmark, Reading
} = models;
const { generateSlug, getReadTime } = ArticleHelper;
const { successResponse, errorResponse } = ServerResponse;

/**
 *
 *
 * @export
 * @class ArticleController
 */
export default class ArticleController {
  /**
   *Method To create a new article
   *
   * @static
   *
   * @param {object} req - express request object
   * @param {object} res - exporess response object
   * @param {function} next - function to pass errors to error handler
   *
   * @returns {object} response object with details of article
   *
   * @memberof ArticleController
   */
  static async createArticle(req, res, next) {
    try {
      const { id } = req.user;
      const {
        title, description, body, tags, status
      } = req.body;

      const slug = generateSlug(title);
      const readTime = getReadTime(body);
      const article = await Article.create({
        title,
        slug,
        body,
        description,
        status,
        tagsList: tags ? [...tags] : [],
        userId: id,
        readTime
      });
      const { firstName, lastName } = req.user;
      Notification.newArticle(req, article.slug, article.title, firstName, lastName);

      return successResponse(res, 201, 'article', article);
    } catch (err) {
      return next(err);
    }
  }


  /**
   *
   * Method to get one article by the slug
   *
   * @static
   *
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @param {function} next - function to pass errors to the error handler
   *
   * @returns {object} article
   *
   * @memberof ArticleController
   */
  static async getSingleArticleBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const article = await Article.findOne({
        where: { slug, status: 'published' },
        include: [
          { // Author
            model: User,
            as: 'author',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            include: [{
              model: Profile,
              as: 'profile',
            }]
          },
          { // Article Comments
            model: models.Comment,
            as: 'articlecomment',
            attributes: ['body', 'likes', 'createdAt', 'updatedAt'],
            include: [
              { // user
                model: models.User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email', 'id'],
              }
            ]
          },
        ],
      });
      if (!article) {
        return errorResponse(res, 404, { article: 'Article not found' });
      }
      // Update Reading table
      if (req.user) {
        const userId = req.user.id;
        const articleId = article.dataValues.id;
        await Reading.findOrCreate({ where: { userId, articleId } });
      }
      await Article.increment({ readCount: 1 }, { where: { slug } });

      return successResponse(res, 200, 'article', article);
    } catch (err) {
      return next(err);
    }
  }


  /**
   *
   *
   * @static
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {object} articles object
   *
   * @memberof ArticleController
   */
  static async getAllArticles(req, res, next) {
    try {
      let articles;
      const { tag, page, limit } = req.query;
      const pageNumber = pagination(page, limit);
      if (tag) {
        articles = await Article.findAll({
          offset: pageNumber.offset,
          limit: pageNumber.limit,
          subQuery: false,
          where: {
            tagsList: {
              [Op.contains]: [`${tag}`],
            },
            status: 'published'
          },
          include: [
            { // Author
              model: User,
              as: 'author',
              attributes: ['id', 'firstName', 'lastName', 'email'],
              include: [{
                model: Profile,
                as: 'profile',
              }]
            },
            { // Article Comments
              model: models.Comment,
              as: 'articlecomment',
              attributes: ['body', 'likes', 'createdAt', 'updatedAt'],
              include: [
                { // user
                  model: models.User,
                  as: 'user',
                  attributes: ['firstName', 'lastName', 'email', 'id'],
                }
              ]
            },
          ],
        });
        return successResponse(res, 200, 'articles', articles);
      }

      articles = await Article.findAll({
        offset: pageNumber.offset,
        limit: pageNumber.limit,
        subQuery: false,
        where: {
          status: 'published'
        },
        include: [
          { // Author
            model: User,
            as: 'author',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            include: [{
              model: Profile,
              as: 'profile',
            }]
          },
          { // Article Comments
            model: models.Comment,
            as: 'articlecomment',
            attributes: ['body', 'likes', 'createdAt', 'updatedAt'],
            include: [
              { // user
                model: models.User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email', 'id'],
              }
            ]
          },
        ],
      });

      return successResponse(res, 200, 'articles', articles);
    } catch (err) {
      return next(err);
    }
  }


  /**
   * Get all published articles by an author
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} articles by an author
   * @memberof ArticleController
   */
  static async getArticlesByAuthor(req, res, next) {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      const author = await User.findOne({ where: { id } });
      if (!author) {
        return errorResponse(res, 404, { article: 'Author not found' });
      }
      const pageNumber = pagination(page, limit);
      const articles = await Article.findAll({
        offset: pageNumber.offset,
        limit: pageNumber.limit,
        subQuery: false,
        where: {
          status: 'published',
          userId: author.id,
        },
        include: [
          { // Author
            model: User,
            as: 'author',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            include: [{
              model: Profile,
              as: 'profile',
            }]
          },
          { // Article Comments
            model: models.Comment,
            as: 'articlecomment',
            attributes: ['body', 'likes', 'createdAt', 'updatedAt'],
            include: [
              { // user
                model: models.User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email', 'id'],
              }
            ]
          },
        ],
      });

      return successResponse(res, 200, 'articles', articles);
    } catch (err) {
      return next(err);
    }
  }


  /**
   * Get all articles for any author including drafts
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {object} next
   *
   * @returns {object} author's articles
   *
   * @memberof ArticleController
   */
  static async getAuthorOwnArticles(req, res, next) {
    try {
      const { id } = req.user;

      const articles = await Article.findAll({
        where: {
          userId: id
        },
        include: [
          { // Author
            model: User,
            as: 'author',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            include: [{
              model: Profile,
              as: 'profile',
            }]
          },
          { // Article Comments
            model: models.Comment,
            as: 'articlecomment',
            attributes: ['body', 'likes', 'createdAt', 'updatedAt'],
            include: [
              { // user
                model: models.User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email', 'id'],
              }
            ]
          },
        ],
        order: [['updatedAt', 'DESC']],
      });

      return successResponse(res, 200, 'articles', articles);
    } catch (err) {
      return next(err);
    }
  }


  /**
   * Edit an article
   *
   * @static
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {object} details of newly edited article
   *
   * @memberof ArticleController
   */
  static async editArticle(req, res, next) {
    try {
      const { slug } = req.params;
      const { id } = req.user;
      const {
        title, body, description, status
      } = req.body;

      const foundArticle = await Article.findOne({
        where: {
          slug,
          userId: id
        }
      });

      if (!foundArticle) {
        return errorResponse(res, 404, { article: 'Article not found' });
      }

      const updatedArticle = await Article.update(
        {
          title, body, description, status
        },
        {
          where: {
            slug,
            userId: id
          },
          returning: true
        }
      );
      return successResponse(res, 200, 'article', updatedArticle[1][0]);
    } catch (err) {
      return next(err);
    }
  }


  /**
   * Delete an article
   *
   * @static
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {object} object with message converning deleted article
   *
   * @memberof ArticleController
   */
  static async deleteArticle(req, res, next) {
    try {
      const { slug } = req.params;
      const { id } = req.user;

      const foundArticle = await Article.findOne({
        where: {
          slug,
          userId: id
        }
      });

      if (!foundArticle) {
        return errorResponse(res, 404, { article: 'Article not found' });
      }

      const { status } = foundArticle;

      if (status === 'published' || status === 'draft') {
        await Article.update(
          {
            status: 'trash'
          },
          {
            where: {
              slug,
              userId: id
            },
            returning: true
          }
        );

        return successResponse(res, 200, 'article', { message: 'Article has been moved to your trash' });
      }

      await Article.destroy({
        where: {
          slug,
          userId: id
        }
      });

      return successResponse(res, 200, 'article', { message: 'Article has been deleted' });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * @static
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @method bookmarkArticle
   * @returns {object} returns the details of the bookmarkedmitem
   * @static
   */
  static async bookmarkArticle(req, res, next) {
    try {
      const { id: articleId } = req.params;
      const { id } = req.user;
      const bookMarked = await Bookmark.findOne({
        where: {
          userId: id,
          articleId
        }
      });
      if (bookMarked) {
        await Bookmark.destroy({ where: { userId: id } });
        return successResponse(res, 200, 'bookmark', { message: 'Article has been removed from bookmarked successfully' });
      }
      try {
        await Bookmark.create({
          userId: id,
          articleId,
        });
      } catch (error) {
        return errorResponse(res, 400, {
          bookmark: 'Something went wrong, unable to bookmark article'
        });
      }
      return successResponse(res, 200, 'bookmark', { message: 'Article has been bookmarked successfully' });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @param {object} req express request object
   * @param {Object} res express respond object
   * @param {function} next
   * @returns {object} All the articles bookmarked by the user
   */
  static async getAllBookmark(req, res, next) {
    try {
      const { id } = req.user;
      const { id: userId } = req.params;
      if (id !== userId) {
        return errorResponse(res, 403, 'You are not allowed to view this user\'s bookmarks');
      }
      const bookmarks = await models.Bookmark.findAll({
        where: { userId: id },
        include: [
          {
            model: models.Article,
            as: 'article',
          }
        ]
      });
      return successResponse(res, 200, 'bookmarks', { message: 'Bookmarks fetched successfully', bookmarks });
    } catch (error) {
      return next(error);
    }
  }

  /**
     * Share an article
     *
     * @static
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     *
     * @returns {object} object
     *
     * @memberof ArticleController
     */
  static async shareArticle(req, res, next) {
    try {
      const { slug } = req.params;
      const { email } = req.body;
      const article = await Article.findOne({ where: { slug } });

      if (!article) return errorResponse(res, 404, { article: 'Article not found' });

      const { title: articleTitle } = article.dataValues;

      if (req.url.search(/\/mail/g) > 0) {
        ShareArticle.shareArticleByMail(req, email, articleTitle, slug);
        return successResponse(res, 200, 'article', { message: 'Article has been successfully shared ' });
      }
      if (req.url.search(/\/twitter/g) > 0) {
        const shareLink = ShareArticle.shareArticleByTwitter(req, slug);
        return res.redirect(shareLink);
      }
      if (req.url.search(/\/facebook/g) > 0) {
        const shareLink = ShareArticle.shareArticleByFacebook(req, slug);
        return res.redirect(shareLink);
      }
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Report an article
   * @param {object} req express request object
   * @param {Object} res express respond object
   * @param {function} next
   * @returns {object} object with message converning reported article
   *
   * @memberof ArticleController
   */
  static async reportArticle(req, res, next) {
    try {
      const { slug } = req.params;
      const userId = req.user.id;
      const { reportTitle, reportBody } = req.body;

      const article = await Article.findOne({ where: { slug } });
      if (!article) return errorResponse(res, 404, { message: 'Article not found' });

      const articleId = article.dataValues.id;

      const report = await Report.create({
        userId,
        articleId,
        reportTitle,
        reportBody,
      });

      const userReportsOnArticle = await Report.findAndCountAll({ where: { userId, articleId } });

      // Multiple reports on an article by a user should count as 1 report
      if (!(userReportsOnArticle.count > 1)) {
        // Update reports count on article table
        await Article.update(
          { reports: (article.dataValues.reports + 1) },
          { where: { slug } },
        );
      }

      return successResponse(res, 201, 'report', report.dataValues);
    } catch (error) {
      return next(error);
    }
  }
}
