import models from '../database/models';
import ServerResponse from '../modules/ServerResponse';
import pagination from '../helpers/Pagination';

const { User } = models;
const { successResponse, errorResponse } = ServerResponse;

/**
*
*
* @export
* @class AdminController
*/
export default class AdminController {
  /**
   *
   * @static
   *
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} returns users data
   *
   * @memberof AuthController
   */
  static async getAllUsers(req, res, next) {
    try {
      const { page, limit } = req.query;
      const pageNumber = pagination(page, limit);
      const allUsers = await User.findAll({
        offset: pageNumber.offset,
        limit: pageNumber.limit,
        attributes: ['id', 'email', 'firstName', 'lastName', 'type', 'createdAt']
      });
      return successResponse(res, 200, 'users', allUsers);
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * @static
   *
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} deletes user
   *
   * @memberof AuthController
   */
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const findUser = await User.findOne({
        where: { id }
      });
      if (!findUser) errorResponse(res, 404, { user: 'User not found' });
      await User.destroy({ where: { id: findUser.id } });
      return successResponse(res, 200, 'user', { message: 'User has been deleted' });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * @static
   *
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} update user
   *
   * @memberof AuthController
   */
  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const {
        email,
        firstName,
        lastName,
        type
      } = req.body;

      const findUser = await User.findOne({ where: { id } });
      if (!findUser) errorResponse(res, 404, { user: 'User not found' });
      await User.update({
        email,
        firstName,
        lastName,
        type
      }, { where: { id } });
      const { dataValues: userData } = await User.findOne({ where: { id } });
      const {
        email: updatedEmail,
        firstName: updatedFirstName,
        lastName: updatedLastName,
        type: updatedType
      } = userData;
      const resData = {
        message: 'User has been updated',
        userDetails: {
          email: updatedEmail,
          firstName: updatedFirstName,
          lastName: updatedLastName,
          type: updatedType
        }
      };
      return successResponse(res, 200, 'user', resData);
    } catch (err) {
      return next(err);
    }
  }
}
