import dotenv from 'dotenv';
import Postals from './Postals';

dotenv.config();
/**
 *
 *
 * @export
 * @class EmailVerification
 */
export default class EmailVerification {
  /**
  *
  * @static
  * @param {string} requestInfo - request information
  * @param {string} recipient - recipient of the email
  * @param {string} name - name of the recipient
  * @param {string} token - verification token
  * @memberof EmailVerification
  * @returns {function} - returns a function call
  */
  static sendVerificationEmail(requestInfo, recipient, name, token) {
    const email = recipient;
    const content = `<img src = ${process.env.APP_LOGO}>
                    <br><h1>Welcome ${name}</h1><br>
                    <h2>Please click the link below to confirm your email</h2><br>
                    <h2><a href = '${process.env.FRONTEND_URL_EMAIL_VERIFICATION}?email=${email}&token=${token}'>Confirm Email</a></h2>
                    `;

    Postals.sendEmail(
      recipient,
      'mazus.ah@gmail.com',
      'Welcome to Authors\' Haven',
      content
    );
  }
}
