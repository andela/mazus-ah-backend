import models from '../database/models';
import Helper from '../helpers/Auth';
import EmailVerification from '../helpers/EmailVerification';

/**
 *
 *
 * @export
 * @class AuthController
 */
export default class AuthController {
  /**
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns user data
   * @memberof AuthController
   */
  static async signUp(req, res) {
    const {
      firstName, lastName, email, password
    } = req.body;

    const foundUser = await models.User.findOne({ where: { email } });
    if (foundUser) {
      return res.status(409).send({
        message: 'This User already exist'
      });
    }
    const hashedPassword = Helper.hashPassword(password);
    const verificationToken = Helper.hashUserData(email);
    const user = {
      firstName,
      lastName,
      email,
      isVerified: false,
      verificationToken,
      password: hashedPassword,
      type: 'user'
    };

    const registeredUser = await models.User.create(user);
    const token = Helper.createToken({
      id: registeredUser.id,
      email
    });

    // This line sends the registered user an email
    EmailVerification.sendVerificationEmail(registeredUser.email, registeredUser.firstName,
      registeredUser.verificationToken);

    return res.status(201).send({
      message: 'Your Account has been created successfully!',
      user: {
        token,
        id: registeredUser.id,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        email: registeredUser.email,
        isVerified: registeredUser.isVerified,
        verificationToken: registeredUser.verificationToken
      }
    });
  }

  /**
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns an object depending on the outcome
   * @memberof AuthController
   */
  static async verifyEmail(req, res) {
    try {
      const { email, token } = req.query;
      const foundUser = await models.User.findOne({ where: { email } });
      if (foundUser.verificationToken === token) {
        const verifiedUser = await models.User.update({ isVerified: true }, { where: { email } });
        res.status(200).send({ message: 'Email Verified', isVerified: !!verifiedUser, });
      } else {
        res.status(400).send({ message: 'Incorrect Credentials', isVerified: foundUser.isVerified });
      }
    } catch (error) {
      res.status(500).send({ status: 500, mesaage: error });
    }
  }
}
