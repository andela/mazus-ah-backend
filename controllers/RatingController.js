import models from '../database/models';
import ServerResponse from '../modules';
import pagination from '../helpers/Pagination';
import RateHelpers from '../helpers/RateHelpers';

const { successResponse, notFoundError, errorResponse } = ServerResponse;


const {
  fetchArticle, checkAuthor, checkRateData, createRating, updateRating
} = RateHelpers;


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

  /**
   *
   * @static
   *
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next express middleware object
   *
   * @returns {object} returns rating data
   *
   * @memberof RatingController
   */
  static async userRating(req, res, next) {
    try {
      const { rate } = req.body;
      const { slug } = req.params;
      const user = req.user.id;
      const findArticle = await fetchArticle(slug);
      if (!findArticle) return errorResponse(res, 404, { message: 'Article with that slug does not exist' });

      const findUser = await checkAuthor(slug);
      const { userId, id } = findUser.dataValues;
      if (userId === user) return errorResponse(res, 400, { message: "You can't rate your article" });

      const rateData = {
        rate,
        userId: user,
        articleId: id,
      };

      const findRateData = await checkRateData(user, id);
      if (findRateData) await updateRating(rate, id, user);
      else await createRating(rateData);

      return successResponse(res, 201, 'article', {
        message: 'Your rating has been added successfully',
        articleId: id,
        rate: rateData.rate,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      });
    } catch (err) {
      return next(err);
    }
  }
}
