import models from '../database/models';
import ServerResponse from '../modules/ServerResponse';

const { User } = models;
const { successResponse } = ServerResponse;

/**
 * @class EmailSubscription
 * @exports EmailSubscription
 */
export default class EmailSubscription {
  /**
     * @static
     *
     * @description allows a user opt in or out of email notification
     *
     * @param {object} req request object
     * @param {object} res response object
     * @param {function} next response object
     * @returns {object} returns follow data
     *
     * @memberof emailNotifySubscription
     */
  static async emailNotifySubscription(req, res, next) {
    const { id } = req.user;
    try {
      const foundUser = await User.findOne({ raw: true, where: { id } });
      if (foundUser.emailNotify) {
        await User.update({ emailNotify: false }, { where: { id } });
        return successResponse(res, 200, 'subscription', 'You have unsubscribed for email notifications');
      }
      await User.update({ emailNotify: true }, { where: { id } });
      return successResponse(res, 200, 'subscription', { message: 'You have subscribed for email notifications' });
    } catch (error) {
      return next(error);
    }
  }
}
