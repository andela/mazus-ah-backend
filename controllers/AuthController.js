import models from '../database/models';
import Helper from '../helpers/Auth';
import EmailVerification from '../helpers/EmailVerification';
import ServerResponse from '../modules';

const { successResponse } = ServerResponse;
const { BlacklistedToken, User } = models;

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
      type: 'user',
    };

    const registeredUser = await models.User.create(user);
    const token = Helper.createToken({
      id: registeredUser.id,
      email,
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
      }
    });
  }

  /**
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @returns {object} returns user data
   * @memberof AuthController
   */
  static async userSignin(req, res) {
    const { email, password } = req.body;

    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send({
        message: 'You Entered an incorrect Email or Password'
      });
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
      return res.status(401).send({
        message: 'You Entered an incorrect Email or Password'
      });
    }
    return res.status(200).send({
      message: 'You have successfully logged in',
      user: {
        token,
        email,
        firstName,
        lastName,
        isVerified,
      }
    });
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
      const foundUser = await models.User.findOne({ where: { email } });
      if (foundUser.verificationToken === token) {
        const verifiedUser = await models.User.update({ isVerified: true }, { where: { email } });
        res.status(200).send({ message: 'Email Verified', isVerified: !!verifiedUser });
      } else {
        res.status(400).send({ message: 'Incorrect Credentials', isVerified: foundUser.isVerified });
      }
    } catch (error) {
      next(error);
    }
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
