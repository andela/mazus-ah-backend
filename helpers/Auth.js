import jwt, { verify } from 'jsonwebtoken';
import { hashSync } from 'bcryptjs';
import { config } from 'dotenv';

config();

/**
 * Handles access token generation and verification
 */
class Helper {
  /**
   * @description Handles access token generation
   * @param {object} payload - The user credential {id, isAdmin}
   * @return {string} access token
   */
  static createToken(payload) {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24d' });
  }

  /**
   * @description Handles access token verification
   * @param {string} token - The user credential {id, isAdmin}
   * @return {object} access token values
   */
  static verifyToken(token) {
    return verify(token, process.env.SECRET_KEY);
  }

  /**
   * @method hashPassword
   * @description Hashes the user inputed password
   * @param {string} password - The user password to be hashed
   * @returns {string} A string of the hashed password
   */
  static hashPassword(password) {
    return hashSync(password, 10);
  }

  /**
   * @method hashUserData
   * @description Hashes the user inputed password
   * @param {string} user - The user password to be hashed
   * @returns {string} A string of the hashed password
   */
  static hashUserData(user) {
    return hashSync(user, 10);
  }
}

export default Helper;
