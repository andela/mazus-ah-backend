import { check, validationResult, param } from 'express-validator';
import models from '../database/models'

const validate = {
  signup: [
    check('email')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Email is required')
      .isEmail()
      .trim()
      .withMessage('Please input a valid email address'),
    check('firstName')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('First name is required')
      .isAlpha()
      .trim()
      .withMessage('First name can only contain letters'),
    check('lastName')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Last name is required')
      .isAlpha()
      .trim()
      .withMessage('Last name can only contain letters'),
    check('password')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Password is required')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/, 'i')
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter and one numeric digit')
      .trim()
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
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
  createProfileValidate: [
    check('avatar')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Avatar is required')
      .isURL()
      .withMessage('Avatar is not a valid URL, please input a valid URL'),
    check('bio')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Bio is required')
      .not()
      .isInt()
      .withMessage('Bio is not a valid string, please input a valid string'),
      (req, res, next) => {
        const errors = validationResult(req);
        const errorMessage = [];
        if (!errors.isEmpty()) {
          errors.array({ onlyFirstError: true }).forEach((err) => {
            errorMessage.push(err.msg);
          });
          return res.status(400).json({
            errors: errorMessage,
          });
        }
        return next();
      }
  ],
  editProfileValidate: [
    check('avatar')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Avatar is required')
      .isURL()
      .withMessage('Avatar is not a valid URL, please input a valid URL'),
    check('bio')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Bio is required')
      .not()
      .isInt()
      .withMessage('Bio is not a valid string, please input a valid string'),  
    check('firstName')
      .isAlpha()
      .trim()
      .withMessage('FirstName is not a valid String, please input a valid string'),
    check('lastName')
      .isAlpha()
      .trim()
      .withMessage('LastName is not a valid string, please input a valid string'),  
      (req, res, next) => {
        const errors = validationResult(req);
        const errorMessage = [];
        if (!errors.isEmpty()) {
          errors.array({ onlyFirstError: true }).forEach((err) => {
            errorMessage.push(err.msg);
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
      .custom(async id => {
        const isExist = await models.User.findOne({ where: { id } });
        if (!isExist) {
          throw new Error('No User with the specified ID was found');
        }
        return true;
      }),
      (req, res, next) => {
        const errors = validationResult(req);
        const errorMessage = [];
        if (!errors.isEmpty()) {
          errors.array({ onlyFirstError: true }).forEach((err) => {
          errorMessage.push(err.msg);
        });
        return res.status(200).json({
          errors: errorMessage,
        });
      }
      return next();
    }
  ]
};

export default validate;
