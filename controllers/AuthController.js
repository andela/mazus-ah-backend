import models from '../database/models';
import Helper from '../helpers/Auth';
import EmailVerification from '../helpers/EmailVerification';
import ForgotPasswordEmail from '../helpers/ForgotPasswordEmail';
import ServerResponse from '../modules';

const { successResponse } = ServerResponse;
const { BlacklistedToken, User } = models;
const { sendResetEmail } = ForgotPasswordEmail;

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
      firstName, lastName, email, password,
    } = req.body;

    const foundUser = await User.findOne({ where: { email } });
    if (foundUser) {
      return res.status(409).send({
        message: 'This User already exist',
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
    EmailVerification.sendVerificationEmail(
      req, registeredUser.email, registeredUser.firstName,
      verificationToken
    );

    return res.status(201).send({
      message: 'Your Account has been created successfully!',
      user: {
        token,
        id: registeredUser.id,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        email: registeredUser.email,
        isVerified: registeredUser.isVerified,
        verificationToken,
      },
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
        res.status(200).send({ message: 'Email Verified', isVerified: !!verifiedUser });
      } else {
        res.status(400).send({ message: 'Incorrect Credentials', isVerified: foundUser.isVerified });
      }
    } catch (error) {
      res.status(500).send({ mesaage: error });
    }
  }

  /**
   *
   * @param {*} req express request object
   * @param {*} res express response object
   * @returns {object} returns an object depending on the outcome
   * @memberof AuthController
   */
  static async forgotPassword(req, res) {
    const { email } = req.body;
    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) {
      return res.status(404).send({
        errors: {
          message: 'You are not an existing user, please sign up',
        }
      });
    }
    const { id } = foundUser.dataValues;

    const token = Helper.createToken({
      id,
      email
    });
    sendResetEmail(req, email, token);
    return res.status(200).send({
      email,
      token,
      message: 'Your reset link has been sent to your email'
    });
  }

  /**
   *
   * @param {*} req express request object
   * @param {*} res express response object
   * @returns {object} returns an object depending on the outcome
   * @memberof AuthController
   */
  static async resetPassword(req, res) {
    const
      {
        password,
        confirmPassword
      } = req.body;
    const genericWordsArray = ['Password123', 'Qwerty123', 'Password', 123];
    const genericWord = genericWordsArray.find(word => password.includes(word));
    if (genericWord) {
      return res.status(400).send({
        errors: {
          message: 'Do not use a common word as the password',
        }
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).send({
        errors: {
          message: 'Password doesn\'t match, Please check you are entering the right thing!',
        }
      });
    }
    const { token } = req.params;
    const { id, email } = await Helper.verifyToken(token);
    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) {
      return res.status(404).send({
        errors: {
          message: 'You are not an existing user, please sign up',
        }
      });
    }
    const doubleReset = await BlacklistedToken.findOne({ where: { token } });
    if (doubleReset) {
      return res.status(409).send({
        errors: {
          message: 'This link has already been used once, please request another link.',
        }
      });
    }
    const hashedPassword = Helper.hashPassword(password);
    await models.User.update({ password: hashedPassword }, { where: { email } });
    await BlacklistedToken.create({ token, userId: id });
    return res.status(200).send({
      message: 'Your Password has been reset successfully'
    });
  }

  /**
   * Method to log a user out
   *
   * @static
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {object} response object with message
   *
   * @memberof AuthController
   */
  static async logout(req, res, next) {
    try {
      const { authorization } = req.headers;
      const { id } = req.user;
      const token = authorization.split(' ')[1];
      await BlacklistedToken.create({ token, userId: id });
      return successResponse(res, 200, { message: 'Successfully logged out' });
    } catch (err) {
      return next(err);
    }
  }
}
