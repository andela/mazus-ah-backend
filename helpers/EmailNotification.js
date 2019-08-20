import moment from 'moment';
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

    const content = `<img src = ${process.env.APP_LOGO}>
                    <br><h1>Hello ${name}</h1><br>
                    <h2>${articleBy} just posted a new article</h2><br>
                    <h2><a href = ${articleUrl}>${articleTitle}</a></h2>
                    `;

    Postals.sendEmail(
      recipient,
      'mazus.ah@gmail.com',
      'New Article: Authors\' Haven',
      content
    );
  }

  /**
  *
  * @static
  * @param {string} recipient - recipient of the email
  * @param {string} name - name of the recipient
  * @param {object} payloadDetails - payload details
  * @memberof EmailNotification
  * @returns {function} - returns a function call
  */
  static sendEmailForReportedArticle(recipient, name, payloadDetails) {
    const {
      articleTitle,
      articleUrl,
      titleOfReport,
      bodyOfReport,
      time
    } = payloadDetails;
    const content = `<img src = ${process.env.APP_LOGO}>
                    <div>
                    <h2>Hello ${name},</h2>
                    <h2>
                    Your article <a href = ${articleUrl}>${articleTitle}</a>
                    was reported Today, ${moment(time).format('MMMM Do YYYY')} at ${moment(time).format('h:mm:ss a')}. 
                    Please read through the report and promptly make changes.<br><br>
                    REPORT DETAILS!<br>
                    Title: ${titleOfReport}<br>
                    Body: ${bodyOfReport}
                    </h2>
                    </div>
                    <div>
                    <h4>Read our Policies and Regulations here.</h4>
                    </div>`;

    Postals.sendEmail(
      recipient,
      'mazus.ah@gmail.com',
      'Your article was reported: Authors\' Haven',
      content
    );
  }
}
