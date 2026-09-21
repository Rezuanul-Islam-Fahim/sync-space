import { body } from 'express-validator';
import {
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
} from '../constants/index.js';

/**
 * Creates an express-validator chain for email field validation.
 *
 * @param {{ EMAIL_REQUIRED: string, EMAIL_INVALID: string }} messages
 * @returns {import('express-validator').ValidationChain}
 */
export const createEmailValidator = messages =>
    body('email')
        .notEmpty()
        .withMessage(messages.EMAIL_REQUIRED)
        .bail()
        .isEmail()
        .withMessage(messages.EMAIL_INVALID)
        .normalizeEmail();

/**
 * Creates an express-validator chain for password field validation.
 *
 * @param {{ PASSWORD_REQUIRED: string, PASSWORD_LENGTH_ERROR: string }} messages
 * @returns {import('express-validator').ValidationChain}
 */
export const createPasswordValidator = messages =>
    body('password')
        .notEmpty()
        .withMessage(messages.PASSWORD_REQUIRED)
        .bail()
        .isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
        .withMessage(messages.PASSWORD_LENGTH_ERROR);
