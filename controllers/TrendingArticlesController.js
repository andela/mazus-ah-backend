import models from '../database/models';
import ServerResponse from '../modules';


const { Article, User, Profile } = models;
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
     *
     * @returns {object} trending data
     * @memberof Trending
     */
  static async trend(req, res) {
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
    return successResponse(res, 200, 'trends', itsTrending);
  }
}
