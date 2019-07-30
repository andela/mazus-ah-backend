import { check, validationResult } from 'express-validator';

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
        if (value.length > 3) {
          return false;
        }
        return value;
      })
      .withMessage('Only a maximum of 3 tags are allowed'),
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
