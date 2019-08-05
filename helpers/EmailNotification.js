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
  * @param {string} requestInfo - request information
  * @param {string} recipient - recipient of the email
  * @param {string} name - name of the recipient
  * @param {object} payloadDetails - payload details
  * @memberof EmailNotification
  * @returns {function} - returns a function call
  */
  static sendNotificationEmail(requestInfo, recipient, name, payloadDetails) {
    const email = recipient;
    const content = `<img src = 'https://res.cloudinary.com/dsqyhgfws/image/upload/v1564047885/assets/logo_hjqgbb.png'>
                    <br><h1>Hello ${name}</h1><br>
                    <h2>Please click the link below to confirm your email</h2><br>
                    <h2><a href = '${requestInfo.protocol}://${requestInfo.get('host')}/api/v1/auth/verify?email=${email}&token=${token}'>Confirm Email</a></h2>
                    `;

    Postals.sendEmail(
      recipient,
      'mazus.ah@gmail.com',
      'Welcome to Authors Haven',
      content
    );
  }
}
