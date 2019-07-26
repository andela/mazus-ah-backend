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
  * @returns {boolean} returns true or false
  * @memberof Postals
  */
  static async sendEmail(recipient, sender, emailSubject, content) {
    const message = {
      to: recipient,
      from: sender,
      subject: emailSubject,
      html: content,
    };
    try {
      await sendGridMail.send(message);
      return true;
    } catch (error) {
      return false;
    }
  }
}
