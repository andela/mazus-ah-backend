import Pusher from 'pusher';
import dotenv from 'dotenv';
import models from '../database/models';
import EmailNotification from './EmailNotification';

const { User, Follower } = models;

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

  /**
   *
   * @method newArticle
   * @param {object} requestInfo request object
   * @param {uuid} articleSlug the id of the article
   * @param {string} title the article's title
   * @param {string} firstName  the publisher's first Name
   * @param {string} lastName the publish's last name
   * @returns {null} null
   */
  static async newArticle(requestInfo, articleSlug, title, firstName, lastName) {
    const { id: userId } = requestInfo.user;
    const followers = await Follower.findAll({
      raw: true,
      where: { userId },
      include: [
        {
          model: User,
          as: 'followings',
          attributes: ['id', 'firstName', 'email', 'emailNotify']
        }
      ]
    });
    const subscribers = followers.filter(subscriber => subscriber['followings.emailNotify']);
    const payload = {
      articleBy: `${firstName} ${lastName}`,
      articleTitle: title,
      articleUrl: `${requestInfo.protocol}://${requestInfo.get('host')}/api/v1/articles/${userId}/${articleSlug}`,
    };
    followers.map(async (follower) => {
      const { followerId } = follower;
      await this.inAppNotification(payload, followerId, false, 'new article');
      await this.pushNotification(followerId, payload);
    });
    if (process.env.NODE_ENV !== 'test') {
      subscribers.map(async (subscribedFollower) => {
        const subscribedFollowerEmail = subscribedFollower['followings.email'];
        const subscribedFollowerName = subscribedFollower['followings.firstName'];
        EmailNotification.sendNotificationEmail(
          subscribedFollowerEmail,
          subscribedFollowerName,
          payload
        );
      });
    }
  }

  /**
   *
   * @method reportedArticle
   * @param {object} requestInfo request object
   * @param {object} article the article object
   * @param {object} reportDetails
   * @returns {null} null
   */
  static async reportedArticle(requestInfo, article, reportDetails) {
    const { reportTitle, reportBody, createdAt } = reportDetails;
    const { title, slug } = article.dataValues;
    const { email, firstName, id } = article.dataValues.author.dataValues;
    const payload = {
      articleTitle: title,
      articleUrl: `${requestInfo.protocol}://${requestInfo.get('host')}/api/v1/articles/${slug}`,
      titleOfReport: reportTitle,
      bodyOfReport: reportBody,
      time: createdAt,
    };
    await this.inAppNotification(payload, id, false, 'reported article');
    await this.pushNotification(id, payload);
    if (process.env.NODE_ENV !== 'test') {
      EmailNotification.sendEmailForReportedArticle(email, firstName, payload);
    }
  }
}

export default Notification;
