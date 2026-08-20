import { body } from 'express-validator';
import {
    createEmailValidator,
    createPasswordValidator,
} from '../../../shared/middleware/index.js';
import {
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    EMAIL_REQUIRED,
    EMAIL_INVALID,
    PASSWORD_REQUIRED,
    PASSWORD_LENGTH_ERROR,
} from '../../../shared/constants/index.js';

import {
    USERNAME_REQUIRED,
    USERNAME_LENGTH_ERROR,
    DISPLAY_NAME_INVALID,
    DOB_REQUIRED,
    DOB_INVALID,
} from './registration.messages.js';

export const registrationValidation = [
    createEmailValidator({ EMAIL_REQUIRED, EMAIL_INVALID }),
    createPasswordValidator({ PASSWORD_REQUIRED, PASSWORD_LENGTH_ERROR }),

    body('username')
        .notEmpty()
        .withMessage(USERNAME_REQUIRED)
        .bail()
        .trim()
        .isLength({ min: USERNAME_MIN_LENGTH, max: USERNAME_MAX_LENGTH })
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
