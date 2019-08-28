import dotenv from 'dotenv';
import models from '../database/models';
import Helper from '../helpers/Auth';
import ServerResponse from '../modules';
import ForgotPasswordEmail from '../helpers/ForgotPasswordEmail';
import MarkUps from '../helpers/MarkUps';
import SignUserUp from '../helpers/signUpHelper';

dotenv.config();
const { successResponse, errorResponse } = ServerResponse;
const {
  BlacklistedToken,
  User,
} = models;
const { sendResetEmail } = ForgotPasswordEmail;
const { verified, alreadyVerified, incorrectCredentials } = MarkUps;
const { signUpUser } = SignUserUp;

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
   *
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   *
   * @returns {object} returns user data
   *
   * @memberof AuthController
   */
  static async signUp(req, res, next) {
    try {
      const {
        firstName, lastName, email, password, confirmPassword
      } = req.body;
      await signUpUser(req, res, firstName, lastName, email, password, confirmPassword);
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} returns user data
   * @memberof AuthController
   */
  static async userSignin(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return errorResponse(res, 401, { message: 'You Entered an incorrect Email or Password' });
      }
      if (user.status === 'inactive') {
        return errorResponse(res, 401, { message: 'You Have been banned, Please contact an admin' });
      }

      const {
        id, firstName, lastName, email: emailAddress, isVerified, type
      } = user.dataValues;

      const token = Helper.createToken({
        id,
        firstName,
        lastName,
        emailAddress,
        isVerified,
        type,
      });

      const comparePassword = await Helper.comparePassword(password, user.dataValues.password);

      if (!comparePassword) {
        return errorResponse(res, 401, { message: 'You Entered an incorrect Email or Password' });
      }
      return successResponse(res, 200, 'user', { message: 'You have successfully logged in', token });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *Method to log a user out
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
      return successResponse(res, 200, 'data', { message: 'Successfully logged out' });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next
   * @returns {object} returns user data
   */
  static async socialLogin(req, res, next) {
    try {
      if (!req.user) {
        return ServerResponse.notFoundError(req, res);
      }

      // eslint-disable-next-line no-underscore-dangle
      const userData = req.user._json;

      const firstName = userData.name.split(' ')[0];
      const lastName = userData.name.split(' ')[1];
      const { email } = userData;

      const createdUser = await User.findOrCreate({
        where: { email },
        defaults: {
          firstName,
          lastName,
          email,
          isVerified: true,
          password: 'NULL',
        }
      });

      const {
        id, isVerified, type
      } = createdUser[0];

      const token = Helper.createToken({
        id,
        firstName,
        lastName,
        email,
        isVerified,
        type,
      });

      /* istanbul ignore next-line */
      if (createdUser[0].isVerified === true) {
        res.redirect(`${process.env.FRONTEND_URL}/signup?token=${token}`);
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {fucntion} next
   * @returns {function} returns an object depending on the outcome
   * @memberof AuthController
   */
  static async verifyEmail(req, res, next) {
    try {
      const { email, token } = req.query;
      const foundUser = await User.findOne({ where: { email } });
      if (foundUser.isVerified === true) {
        res.setHeader('Content-Type', 'text/html');
        res.send(alreadyVerified);
      } else if (foundUser.verificationToken === token) {
        await User.update({ isVerified: true }, { where: { email } });
        res.setHeader('Content-Type', 'text/html');
        res.send(verified);
      } else if (foundUser.verificationToken !== token) {
        res.setHeader('Content-Type', 'text/html');
        return res.send(incorrectCredentials);
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @param {*} req express request object
   * @param {*} res express response object
   * @param {function} next
   * @returns {object} returns an object depending on the outcome
   * @memberof AuthController
   */
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const foundUser = await User.findOne({ where: { email } });
      if (!foundUser) {
        return errorResponse(res, 404, { message: 'You are not an existing user, please sign up' });
      }
      const { id } = foundUser.dataValues;
      const token = Helper.createToken({
        id,
        email
      });
      /* istanbul ignore next-line */
      if (process.env.NODE_ENV !== 'test') {
        sendResetEmail(req, email, token);
      }
      return successResponse(res, 200, 'auth', { email, token, message: 'Your reset link has been sent to your email' });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @param {*} req express request object
   * @param {*} res express response object
   * @param {function} next
   * @returns {object} returns an object depending on the outcome
   * @memberof AuthController
   */
  static async resetPassword(req, res, next) {
    try {
      const
        {
          password,
          confirmPassword
        } = req.body;
      const genericWordsArray = ['Password123', 'Qwerty123', 'Password', 123];
      const genericWord = genericWordsArray.find(word => password.includes(word));
      if (genericWord) {
        return errorResponse(res, 400, { message: 'Do not use a common word as the password' });
      }
      if (password !== confirmPassword) {
        return errorResponse(res, 400, { message: 'Password doesn\'t match, Please check you are entering the right thing!' });
      }
      const { token } = req.params;
      const { id, email } = await Helper.verifyToken(token);
      const foundUser = await User.findOne({ where: { email } });
      if (!foundUser) {
        return errorResponse(res, 404, { message: 'You are not an existing user, please sign up' });
      }
      const doubleReset = await BlacklistedToken.findOne({ where: { token } });
      if (doubleReset) {
        return errorResponse(res, 409, { message: 'This link has already been used once, please request another link.' });
      }
      const hashedPassword = Helper.hashPassword(password);
      await User.update({ password: hashedPassword }, { where: { email } });
      await BlacklistedToken.create({ token, userId: id });
      return successResponse(res, 200, 'auth', { message: 'Your Password has been reset successfully' });
    } catch (error) {
      return next(error);
    }
  }
}
