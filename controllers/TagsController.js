import models from '../database/models';
import ServerResponse from '../modules/ServerResponse';

const {
  Article,
  Sequelize: { Op },
} = models;
const { successResponse } = ServerResponse;

/**
 *
 *
 * @export
 * @class TagsController
 */
export default class TagsController {
  /**
   *
   *
   * @static
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {array} array of tags
   *
   * @memberof TagsController
   */
  static async getTags(req, res, next) {
    try {
      const articles = await Article.findAll({
        attributes: ['tagsList'],
        where: {
          tagsList: { [Op.ne]: null }
        }
      });

      const tagSet = new Set();
      articles.forEach((article) => {
        article.tagsList.map(t => tagSet.add(t));
      });

      return successResponse(res, 200, 'tags', [...tagSet]);
    } catch (err) {
      return next(err);
    }
  }
}
