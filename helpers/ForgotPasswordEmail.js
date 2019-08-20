import { config } from 'dotenv';
import Postals from './Postals';

config();

/**
 *
 *
 * @export
 * @class ForgotPasswordEmail
 */
export default class ForgotPasswordEmail {
  /**
     *  @static
     * @param {string} requestInfo - request information
     * @param {string} recipient - recipient of the email
     * @param {string} token - reset token
     * @memberof ForgotPasswordEmail
     * @returns {function} - returns a function call
     */
  static sendResetEmail(requestInfo, recipient, token) {
    const email = recipient;
    const content = `<img src = 'https://res.cloudinary.com/dsqyhgfws/image/upload/v1564047885/assets/logo_hjqgbb.png'>
                        <br><h1>Good day,</h1><br>
                        <h2>You requested to reset your Authors' Haven password</h2><br>
                        <h2>Please click the link <a href = '${requestInfo.protocol}://${process.env.RESET_PASSWORD_URL}/${token}'>here</a> to reset your password</h2><br>
                        <h2>If you didn't request a password reset, please ignore this message</h2>
                        `;

    Postals.sendEmail(
      email,
      'mazus.ah@gmail.com',
      'Authors Haven',
      content
    );
  }
}
