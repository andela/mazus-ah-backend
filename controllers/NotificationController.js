import models from '../database/models';
import ServerResponse from '../modules/ServerResponse';

const { Notification } = models;
const { successResponse, errorResponse } = ServerResponse;
/**
 * @class Notiidication
 * @exports Notification
 */
class NotificationController {
  /**
   * Get all notifications
   * @async
   * @param {Object} req - express request object
   * @param {Object} res - Oexpress response object
   * @param {function} next
   * @returns {object} returns notification object
   * @static
   */
  static async getNotifications(req, res, next) {
    try {
      const { id } = req.user;
      const notification = await Notification.findAll({ where: { receiverId: id } });
      return successResponse(res, 200, 'notification', { notification });
    } catch (error) {
      return next(error);
    }
  }

  /**
  * @param {object} req express req body
  * @param {object} res express res body
  * @param {function} next express res body
  * @returns {object} notification update status
  */
  static async readNotification(req, res, next) {
    try {
      const { id } = req.params;
      const { id: receiverId } = req.user;
      const markRead = await Notification.update(
        {
          read: true
        },
        {
          where: {
            id,
            receiverId,
          }
        }
      );
      if (markRead[0]) {
        return successResponse(res, 200, 'notification', { message: 'Notifications successfully updated to read' });
      }
      return errorResponse(res, 400, 'Notification was not updated succesfully');
    } catch (error) {
      next(error);
    }
  }
}


export default NotificationController;
