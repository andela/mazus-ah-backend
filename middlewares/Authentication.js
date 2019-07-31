import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import ServerResponse from '../modules';
import models from '../database/models';

const { config } = dotenv;
const { errorResponse } = ServerResponse;
const { SECRET_KEY } = process.env;
const { BlacklistedToken } = models;

config();

/**
 *
 *
 * @export
 * @class Authentication
 */
export default class Authentication {
  /**
   *Verify token for Authenticated routes
   *
   * @static
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {function} next function
   *
   * @memberof Authentication
   */
  static async verifyToken(req, res, next) {
    try {
      const bearer = req.headers.authorization;
      if (!bearer) {
        return errorResponse(res, 401, { message: 'No token provided' });
      }

      const token = bearer.split(' ')[1];
      const blacklistedToken = await BlacklistedToken.findOne({
        where: { token },
      });

      if (blacklistedToken) {
        return errorResponse(res, 403, {
          message: 'Invalid token provided, please sign in',
        });
      }

      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          return errorResponse(res, 403, {
            message: 'Invalid token provided',
          });
        }

        req.user = decoded;
        return next();
      });
    } catch (err) {
      return next(err);
    }
  }


  /**
   *
   * Method to ensure that only verified users access a route
   *
   * @static
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {(object|function)} error response || next function
   *
   * @memberof Authentication
   */
  static verifiedUserOnly(req, res, next) {
    const { isVerified } = req.user;

    if (!isVerified) {
      return errorResponse(res, 401, { message: 'Your account has not been verified, please verify to continue' });
    }

    return next();
  }
}
