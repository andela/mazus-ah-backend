import models from '../database/models';
import ServerResponse from '../modules';

const { successResponse } = ServerResponse;

/**
 *
 * @export
 * @class userController
 */
export default class userController {
  /**
   *
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} returns all user
   */
  static async getAllUsers(req, res, next) {
    try {
      const allUsers = await models.User.findAll({
        attributes: ['id', 'firstName', 'lastName', 'email', 'isVerified', 'type', 'emailNotify'],
        order: [
          ['firstName', 'ASC'],
        ],
        include: [
          {
            model: models.Profile,
            as: 'profile',
            attributes: ['id', 'bio', 'avatar']
          }
        ]
      });
      return successResponse(res, 200, 'users', { message: 'Users fetched successfully', allUsers });
    } catch (error) {
      return next(error);
    }
  }
}
