import models from '../database/models';
import Helper from '../helpers/Auth';

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
      email,
      firstName,
      lastName
    });
    return res.status(201).send({
      message: 'Your Account has been created successfully!',
      user: {
        token,
        email: registeredUser.email,
        isVerified: registeredUser.isVerified,
        verificationToken
      }
    });
  }
}
