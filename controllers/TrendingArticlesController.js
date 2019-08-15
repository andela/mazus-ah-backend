import models from '../database/models';
import ServerResponse from '../modules';


const {
  Article, User, Profile, Sequelize: { Op },
} = models;
const { successResponse } = ServerResponse;

/**
 * @exports
 * @class Trending
 *
 */
export default class Trending {
  /**
     * @static
     *
     * @description gets trending articles
     *
     * @param {object} req request object
     * @param {object} res response object
     * @param {function} next function
     *
     * @returns {object} trending data
     * @memberof Trending
     */
  static async trend(req, res, next) {
    try {
      const { tag } = req.query;
      if (tag) {
        const itsTrending = await Article.findAll({
          limit: 10,
          where: {
            status: 'published',
            tagsList: {
              [Op.contains]: [`${tag}`],
            },
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
          ],
          order: [
            ['readCount', 'DESC'],
            ['createdAt', 'DESC'],
            ['ratings', 'DESC'],
          ]
        });
        return successResponse(res, 200, 'trends', { articleCount: itsTrending.length, articles: itsTrending });
      }
      const itsTrending = await Article.findAll({
        limit: 10,
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
        ],
        order: [
          ['readCount', 'DESC'],
          ['createdAt', 'DESC'],
          ['ratings', 'DESC'],
        ]
      });
      return successResponse(res, 200, 'trends', { articleCount: itsTrending.length, articles: itsTrending });
    } catch (err) {
      return next(err);
    }
  }
}
