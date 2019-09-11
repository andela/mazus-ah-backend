import { check, validationResult, param } from 'express-validator';

export default {
  articleValidation: [
    check('title')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Title cannot be empty')
      .isLength({ min: 2, max: 244 })
      .withMessage('Title must be between 2 to 244 charaters long'),
    check('status')
      .optional()
      .isIn(['draft', 'published'])
      .withMessage('Status can either be published or draft'),
    check('tags')
      .optional()
      .custom((value) => {
        if (!Array.isArray(value)) {
          return false;
        }
        return value;
      })
      .withMessage('Tags must be grouped in an array')
      .custom((value) => {
        if (value.length > 10) {
          return false;
        }
        return value;
      })
      .withMessage('Only a maximum of 10 tags are allowed'),
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
  validateId: [
    param('id')
      .matches((/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i))
      .withMessage('id is not valid'),
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
  validateGetCurrentArticlState: [
    check('userId')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('userId cannot be empty')
      .matches((/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i))
      .withMessage('userId is not valid'),
    check('articleId')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('articleId cannot be empty')
      .matches((/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i))
      .withMessage('articleId is not valid'),
    check('authorId')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('authorId cannot be empty')
      .matches((/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i))
      .withMessage('authorId is not valid'),
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
  ]
};
