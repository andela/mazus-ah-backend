
import models from '../database/models';
import ServerResponse from '../modules';
import pagination from '../helpers/Pagination';

const { successResponse, notFoundError } = ServerResponse;

/**
 * @class RatingController
 * @exports RatingController
 */
export default class RatingController {
  /**
     *
     * @method getArticleRatings
     *
     * @description get all ratings for an article
     *
     * @param {object} req express request object
     * @param {object} res express response object
     * @param {object} next express next object
     *
     * @returns {object} returns ratings info
     *
     * @memberof RatingController
     */
  static async getArticleRatings(req, res, next) {
    try {
      const { slug } = req.params;
      const article = await models.Article.findOne({ where: { slug } });

      if (article === null) {
        return notFoundError(req, res);
      }

      const pageNumber = pagination(req.query.page, req.query.pageLimit);
      const rating = await models.Article.findAll({
        offset: pageNumber.offset,
        limit: pageNumber.limit,
        subQuery: false,
        include: [
          {
            model: models.Rating,
            as: 'articlerating',
            where: { articleId: article.dataValues.id },
            attributes: ['rate'],

            include: [{
              model: models.User,
              as: 'userdetails',
              attributes: ['firstName', 'lastName'],
            }],
            order: [
              [models.Rating, models.User, 'firstName', 'DESC']
            ]
          },
        ],
      });

      if (!rating.length) {
        return notFoundError(req, res);
      }
      const { articlerating } = rating[0];
      return successResponse(res, 200, 'article', articlerating);
    } catch (error) {
      return next(error);
    }
  }
}
