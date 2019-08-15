import gravatar from 'gravatar';
import models from '../database/models';
import Helper from './Auth';
import EmailVerification from './EmailVerification';
import ServerResponse from '../modules';


const { User, Profile } = models;
const { successResponse, errorResponse } = ServerResponse;

/**
 *
 *
 * @export
 * @class SignUserUp
 */
export default class SignUserUp {
  /**
       *  @static
       * @param {object} req express request object
       * @param {object} res express response object
       * @param {string} firstName - user first name
       * @param {string} lastName - user last name
       * @param {string} email - user email
       * @param {string} password - user password
       * @param {string} confirmPassword - user confirm password
       * @param {string} type - user type
       *
       * @memberof SignUserUp
       * @returns {function} - returns a object
       */
  static async signUpUser(req, res, firstName, lastName, email, password, confirmPassword, type = 'user') {
    const genericWordsArray = [firstName, lastName, 'Password', 'password', 123];
    const genericWord = genericWordsArray.find(word => password.includes(word));
    if (genericWord) {
      return errorResponse(res, 400, { message: 'Do not use a common word as the password' });
    }
    const foundUser = await User.findOne({ where: { email } });
    if (foundUser) {
      return errorResponse(res, 409, { message: 'This User already exist' });
    }
    if (password !== confirmPassword) {
      return errorResponse(res, 400, { message: 'Password doesn\'t match, Please check you are entering the right thing!' });
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
      type,
    };
    const registeredUser = await User.create(user);
    const {
      id,
      firstName: rFirstName,
      lastName: rLastName,
      isVerified,
      type: rtype,
    } = registeredUser;
    const token = Helper.createToken({
      id,
      firstName: rFirstName,
      lastName: rLastName,
      isVerified,
      email,
      type: rtype,
    });
    // This line sends the registered user an email
    /* istanbul ignore next-line */
    if (process.env.NODE_ENV !== 'test') {
      EmailVerification.sendVerificationEmail(
        req, registeredUser.email, registeredUser.firstName,
        verificationToken
      );
    }
    let avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });
    avatar = avatar.substring(2);
    await Profile.create({
      userId: id,
      avatar,
    });
    return successResponse(res, 201, 'user', { message: 'Account has been created successfully!', token });
  }
}
