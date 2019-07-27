import Postals from './Postals';

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
  * @param {string} recipient - recipient of the email
  * @param {string} name - name of the recipient
  * @param {string} token - verification token
  * @memberof EmailVerification
  * @returns {function} - returns a function call
  */
  static async sendVerificationEmail(recipient, name, token) {
    const email = recipient;
    const content = `<img src = 'https://res.cloudinary.com/dsqyhgfws/image/upload/v1564047885/assets/logo_hjqgbb.png'>
                    <br><h1>Welcome ${name}</h1><br>
                    <h2>Please click the link below to confirm your email</h2><br>
                    <h2><a href = 'http://localhost:3000/api/v1/auth/verify?email=${email}&token=${token}'>Confirm Email</a></h2>
                    `;

    Postals.sendEmail(
      recipient,
      'mazus.ah@gmail.com',
      'Welcome to Authors Haven',
      content
    );
  }
}
