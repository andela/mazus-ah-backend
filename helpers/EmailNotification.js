import Postals from './Postals';

/**
 *
 *
 * @export
 * @class EmailNotification
 */
export default class EmailNotification {
  /**
  *
  * @static
  * @param {string} recipient - recipient of the email
  * @param {string} name - name of the recipient
  * @param {object} payloadDetails - payload details
  * @memberof EmailNotification
  * @returns {function} - returns a function call
  */
  static sendNotificationEmail(recipient, name, payloadDetails) {
    const { articleBy, articleTitle, articleUrl } = payloadDetails;

    const content = `<img src = 'https://res.cloudinary.com/dsqyhgfws/image/upload/v1564047885/assets/logo_hjqgbb.png'>
                    <br><h1>Hello ${name}</h1><br>
                    <h2>${articleBy} just posted a new article</h2><br>
                    <h2><a href = ${articleUrl}>${articleTitle}</a></h2>
                    `;

    Postals.sendEmail(
      recipient,
      'mazus.ah@gmail.com',
      'Welcome to Authors Haven',
      content
    );
  }
}
