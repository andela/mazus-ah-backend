import models from '../database/models';
import ServerResponse from '../modules/ServerResponse';
import ArticleHelper from '../helpers/ArticleHelper';

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
      const { slug, email } = req.params;
      const findUser = await User.findOne({ where: { email } });

      if (!findUser) {
        return errorResponse(res, 404, { article: 'Author not found' });
      }

      const article = await Article.findOne({
        where: { slug, status: 'published' },
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
          }]
        }]
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
      const { tag } = req.query;

      if (tag) {
        articles = await Article.findAll({
          where: {
            tagsList: {
              [Op.contains]: [`${tag}`],
            },
            status: 'published'
          },
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            include: [{
              model: Profile,
              as: 'profile',
            }]
          }],
          order: [['ratings', 'DESC']],
        });

        return successResponse(res, 200, 'articles', articles);
      }

      articles = await Article.findAll({
        where: {
          status: 'published'
        },
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
          }]
        }],
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
      const { email } = req.params;
      const author = await User.findOne({ where: { email } });

      if (!author) {
        return errorResponse(res, 404, { article: 'Author not found' });
      }

      const articles = await Article.findAll({
        where: {
          status: 'published',
          userId: author.id,
        },
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
          }]
        }],
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
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
          }]
        }],
        order: [['updatedAt', 'DESC']],
      });

      return successResponse(res, 200, 'articles', articles);
    } catch (err) {
      return next(err);
    }
  }
}
