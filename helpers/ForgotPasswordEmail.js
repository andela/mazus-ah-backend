import Postals from './Postals';

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
  static sendResetEmail({ protocol, hostname }, recipient, token) {
    const { PORT } = process.env;
    const email = recipient;
    const content = `<img src = 'https://res.cloudinary.com/dsqyhgfws/image/upload/v1564047885/assets/logo_hjqgbb.png'>
                        <br><h1>Good day,</h1><br>
                        <h2>You requested to reset your Authors' Haven password</h2><br>
                        <h2>Please click the link <a href = '${protocol}://${hostname}${PORT ? `:${PORT}` : ''}/api/v1/auth/resetpassword/${token}'>here</a> to reset your password</h2><br>
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
