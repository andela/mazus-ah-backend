import models from '../database/models';
import ServerResponse from '../modules/ServerResponse';
import pagination from '../helpers/Pagination';
import SignUserUp from '../helpers/signUpHelper';


const {
  User,
  Profile,
  Article,
  Comment
} = models;
const { successResponse, errorResponse } = ServerResponse;
const { signUpUser } = SignUserUp;
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
      const allUsers = await User.findAndCountAll({
        offset: pageNumber.offset,
        limit: pageNumber.limit,
        attributes: ['id', 'email', 'firstName', 'lastName', 'type', 'createdAt'],
        include: [
          {
            model: Profile,
            as: 'profile',
            attributes: ['bio', 'avatar']

          }
        ]
      });
      const { rows: users, count: usersCount } = allUsers;
      return successResponse(res, 200, 'allUsers', { usersCount, users });
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
      if (!findUser) {
        return errorResponse(res, 404, { user: 'User not found' });
      }
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
      if (!findUser) {
        return errorResponse(res, 404, { user: 'User not found' });
      }
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

  /**
   *
   * @static
   *
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} ban user user
   *
   * @memberof AuthController
   */
  static async banUser(req, res, next) {
    try {
      const { id } = req.params;
      const findUser = await User.findOne({ where: { id } });
      if (!findUser) {
        return errorResponse(res, 404, { message: 'User not found' });
      }
      if (findUser.status === 'inactive') {
        return successResponse(res, 200, 'user', { message: 'User has already been banned' });
      }
      await User.update({ status: 'inactive' }, { where: { id } });
      return successResponse(res, 200, 'user', { message: 'User has been banned successfully' });
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
   * @returns {object} ban user user
   *
   * @memberof AuthController
   */
  static async unbanUser(req, res, next) {
    try {
      const { id } = req.params;
      const findUser = await User.findOne({ where: { id } });
      if (!findUser) {
        return errorResponse(res, 404, { message: 'User not found' });
      }
      if (findUser.status === 'active') {
        return successResponse(res, 200, 'user', { message: 'User has already been unbanned' });
      }
      await User.update({ status: 'active' }, { where: { id } });
      return successResponse(res, 200, 'user', { message: 'User has been unbanned successfully' });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Admin can delete an article
   *
   * @static
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {object} object with message stating admin has deleted an article
   *
   * @memberof AdminController
   */
  static async deleteArticle(req, res, next) {
    try {
      const { slug } = req.params;

      const foundArticle = await Article.findOne({
        where: {
          slug
        }
      });

      if (!foundArticle) {
        return errorResponse(res, 404, { article: 'Article not found' });
      }

      await Article.destroy({
        where: {
          slug
        }
      });

      return successResponse(res, 200, 'article', { message: 'Article has been deleted' });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Admin can delete any comment
   *
   * @static
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {object} object with message stating admin has deleted a comment
   *
   * @memberof AdminController
   */
  static async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;

      const foundComment = await Comment.findOne({
        where: {
          id: commentId
        }
      });

      if (!foundComment) {
        return errorResponse(res, 404, { comment: 'Comment not found' });
      }

      await Comment.destroy({
        where: {
          id: commentId
        }
      });
      return successResponse(res, 200, 'comment', { message: 'Comment has been deleted' });
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
   *
   * @returns {object} returns user data
   *
   * @memberof AuthController
   */
  static async signUpAdmin(req, res, next) {
    try {
      const {
        firstName, lastName, email, password, confirmPassword, type
      } = req.body;
      await signUpUser(req, res, firstName, lastName, email, password, confirmPassword, type);
    } catch (err) {
      return next(err);
    }
  }
}
