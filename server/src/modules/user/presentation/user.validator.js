import { body } from 'express-validator';
import {
    USERNAME_REQUIRED,
    USERNAME_LENGTH_ERROR,
    DISPLAY_NAME_INVALID,
    DOB_REQUIRED,
    DOB_INVALID,
} from './user.messages.js';

export const userProfileValidation = [
    body('username')
        .notEmpty()
        .withMessage(USERNAME_REQUIRED)
        .bail()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage(USERNAME_LENGTH_ERROR),

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
