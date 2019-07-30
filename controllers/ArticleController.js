import models from '../database/models';
import ServerResponse from '../modules/ServerResponse';
import ArticleHelper from '../helpers/ArticleHelper';

const { Article } = models;
const { generateSlug, getReadTime } = ArticleHelper;
const { successResponse } = ServerResponse;

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
}
