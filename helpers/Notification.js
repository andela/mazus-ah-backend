import Pusher from 'pusher';
import dotenv from 'dotenv';
import models from '../database/models';

dotenv.config();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true
});

/**
 * @class Notification
 * @exports Notification
 */
class Notification {
  /**
   *
   * @param {integer} recieverIds
   * @param {object} payload
   * @returns {null} null
   */
  static async pushNotification(recieverIds, payload) {
    pusher.trigger('Notifications', `event_${recieverIds}`, payload);
  }

  /**
   *
   * @method inAppNotification
   * @description add notification to the Notification table
   * @param {object} payload the details of the notification
   * @param {integer} receiverId the id of the person to receive the notification
   * @param {boolean} read has the notification been read true or false
   * @param {string} type the type of notification been sent
   * @returns {null} null
   */
  static async inAppNotification(payload, receiverId, read, type) {
    await models.Notification.create({
      receiverId,
      type,
      read,
      payload,
    });
  }

  /**
   *
   * @method newComment
   * @param {string} slug the article slug
   * @param {uuid} articleId the id of the article
   * @param {string} title the article's title
   * @param {string} firstName  the commenter's first Name
   * @param {string} lastName the commenter's last name
   * @returns {null} null
   */
  static async newComment(slug, articleId, title, firstName, lastName) {
    const bookMarkersDetails = await models.Bookmark.findAll({
      raw: true,
      where: { articleId }
    });
    bookMarkersDetails.map(async (bookMaker) => {
      const payload = {
        commentBy: `${firstName} ${lastName}`,
        articleTitle: title,
        slug,
      };
      const { userId } = bookMaker;
      await this.inAppNotification(payload, userId, false, 'comment');
      await this.pushNotification(userId, payload);
    });
  }
}

export default Notification;
