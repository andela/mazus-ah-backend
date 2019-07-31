import sendGridMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
/**
 *
 *
 * @export
 * @class Postals
 */
export default class Postals {
  /**
  *
  * @static
  * @param {string} recipient - receiver of the email
  * @param {string} sender - sender of the email
  * @param {string} emailSubject
  * @param {string} content - content of the email
  * @returns {function} returns a function
  * @memberof Postals
  */
  static sendEmail(recipient, sender, emailSubject, content) {
    const message = {
      to: recipient,
      from: sender,
      subject: emailSubject,
      html: content,
    };
    return sendGridMail.send(message);
  }
}
