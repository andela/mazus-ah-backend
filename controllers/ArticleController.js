import models from '../database/models';
import ServerResponse from '../modules/ServerResponse';
import ArticleHelper from '../helpers/ArticleHelper';
import pagination from '../helpers/Pagination';
import Notification from '../helpers/Notification';

const {
  Article, User, Profile, Sequelize: { Op }
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
  static async getArticlesArticleBySlug(req, res, next) {
    try {
      const { slug, id } = req.params;
      const findUser = await User.findOne({ where: { id } });

      if (!findUser) {
        return errorResponse(res, 404, { article: 'Author not found' });
      }

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
          order: [['ratings', 'DESC']],
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
        order: [['ratings', 'DESC']],
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
        order: [['ratings', 'DESC']],
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
}
