import { body } from 'express-validator';
import {
    REGISTER_ALLOWED_FIELDS,
    LOGIN_ALLOWED_FIELDS,
} from './auth.constant.js';
import allowedFieldsValidator from '../../shared/middlewares/allowed-fields-validator.middleware.js';
import {
    EMAIL_REQUIRED,
    EMAIL_INVALID,
    USERNAME_REQUIRED,
    USERNAME_LENGTH_ERROR,
    PASSWORD_REQUIRED,
    PASSWORD_LENGTH_ERROR,
    DISPLAY_NAME_INVALID,
    DOB_REQUIRED,
    DOB_INVALID,
} from '../../constants/app-messages.constant.js';

export const registerValidation = [
    allowedFieldsValidator(REGISTER_ALLOWED_FIELDS),

    body('email')
        .notEmpty()
        .withMessage(EMAIL_REQUIRED)
        .bail()
        .isEmail()
        .withMessage(EMAIL_INVALID)
        .normalizeEmail(),

    body('username')
        .notEmpty()
        .withMessage(USERNAME_REQUIRED)
        .bail()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage(USERNAME_LENGTH_ERROR),

    body('password')
        .notEmpty()
        .withMessage(PASSWORD_REQUIRED)
        .bail()
        .isLength({ min: 6 })
        .withMessage(PASSWORD_LENGTH_ERROR),

    body('displayName')
        .optional({ values: 'null' })
        .isString()
        .withMessage(DISPLAY_NAME_INVALID),

    body('dateOfBirth')
        .notEmpty()
        .withMessage(DOB_REQUIRED)
        .bail()
        .isISO8601()
        .withMessage(DOB_INVALID),
];

export const loginValidation = [
    allowedFieldsValidator(LOGIN_ALLOWED_FIELDS),

    body('email')
        .notEmpty()
        .withMessage(EMAIL_REQUIRED)
        .bail()
        .isEmail()
        .withMessage(EMAIL_INVALID)
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage(PASSWORD_REQUIRED)
        .bail()
        .isLength({ min: 6 })
        .withMessage(PASSWORD_LENGTH_ERROR),
];
