/* eslint-disable no-unused-vars */
import Debug from 'debug';

const debug = Debug('dev');
/**
 *Server Response module
 *
 * @export
 * @class ServerResponse
 */
export default class ServerResponse {
  /**
   *Server response for an errored request
   *
   * @static
   * @param {object} res
   * @param {number} status
   * @param {object} error
   * @returns {object} error
   * @memberof ServerResponse
   */
  static errorResponse(res, status, error) {
    return res.status(status).json({
      errors: error,
    });
  }

  /**
   *Server response for a successful request
   *
   * @static
   * @param {object} res
   * @param {number} status
   * @param {object} data
   * @returns {object} - data
   * @memberof ServerResponse
   */
  static successResponse(res, status, data) {
    return res.status(status).json({
      data,
    });
  }

  /**
   *Error when a requested resource is not found
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} errors
   * @memberof ServerResponse
   */
  static notFoundError(req, res) {
    return res.status(404).json({
      errors: { message: 'Resource not found' },
    });
  }

  /**
   *Response for a sever errror
   *
   * @static
   *
   * @param {object} err
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {object} errors
   *
   * @memberof ServerResponse
   */
  static serverErrorResponse(err, req, res, next) {
    return res.status(err.status || 500).json({
      errors: {
        message:
          'Something went wrong, please try again or check back for a fix',
      },
    });
  }

  /**
   *Server Response for errors in development
   *
   * @static
   *
   * @param {object} err
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {object} errors
   *
   * @memberof ServerResponse
   */
  static developmentServerErrorResponse(err, req, res, next) {
    debug(err.stack);
    return res.status(err.status || 500).json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  }
}
