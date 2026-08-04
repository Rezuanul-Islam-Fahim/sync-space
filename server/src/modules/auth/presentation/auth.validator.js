import { body } from 'express-validator';
import { PASSWORD_MIN_LENGTH } from '../../../shared/constants/index.js';
import {
    EMAIL_REQUIRED,
    EMAIL_INVALID,
    PASSWORD_REQUIRED,
    PASSWORD_LENGTH_ERROR,
} from './auth.messages.js';

const emailValidation = body('email')
    .notEmpty()
    .withMessage(EMAIL_REQUIRED)
    .bail()
    .isEmail()
    .withMessage(EMAIL_INVALID)
    .normalizeEmail();

const passwordValidation = body('password')
    .notEmpty()
    .withMessage(PASSWORD_REQUIRED)
    .bail()
    .isLength({ min: PASSWORD_MIN_LENGTH })
    .withMessage(PASSWORD_LENGTH_ERROR);

export const loginValidation = [emailValidation, passwordValidation];
