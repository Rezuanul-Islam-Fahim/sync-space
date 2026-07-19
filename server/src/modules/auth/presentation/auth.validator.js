import { body } from 'express-validator';
import {
    EMAIL_REQUIRED,
    EMAIL_INVALID,
    PASSWORD_REQUIRED,
    PASSWORD_LENGTH_ERROR,
} from './auth.messages.js';

export const registerValidation = [
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

export const loginValidation = [
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
