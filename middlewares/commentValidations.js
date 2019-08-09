import { check, validationResult } from 'express-validator';

const validate = {
  comment: [
    check('body')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('comment body is required')
      .not()
      .isInt()
      .withMessage('comment body is not a valid string, please input a valid string'),
    (req, res, next) => {
      const errors = validationResult(req);
      const errorMessage = {};
      if (!errors.isEmpty()) {
        errors.array({ onlyFirstError: true }).forEach((error) => {
          errorMessage[error.param] = error.msg;
        });
        return res.status(400).json({
          errors: errorMessage,
        });
      }
      return next();
    }
  ],
  validateReport: [
    check('reportTitle')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('A title is required')
      .not()
      .isInt()
      .withMessage('report title is not a valid string, please input a valid string'),
    check('reportBody')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('A body is required')
      .not()
      .isInt()
      .withMessage('report body is not a valid string, please input a valid string'),
    (req, res, next) => {
      const errors = validationResult(req);
      const errorMessage = {};
      if (!errors.isEmpty()) {
        errors.array({ onlyFirstError: true }).forEach((error) => {
          errorMessage[error.param] = error.msg;
        });
        return res.status(400).json({
          errors: errorMessage,
        });
      }
      return next();
    }
  ],
};
export default validate;
