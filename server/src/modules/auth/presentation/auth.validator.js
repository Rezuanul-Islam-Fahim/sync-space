import { body } from 'express-validator';
import {
    EMAIL_REQUIRED,
    EMAIL_INVALID,
    PASSWORD_REQUIRED,
    PASSWORD_LENGTH_ERROR,
} from '../../../shared/constants/index.js';
import {
    createEmailValidator,
    createPasswordValidator,
} from '../../../shared/middleware/index.js';
import { DEVICE_ID_INVALID, REFRESH_TOKEN_REQUIRED } from './auth.messages.js';

const emailValidation = createEmailValidator({
    EMAIL_REQUIRED,
    EMAIL_INVALID,
});

const passwordValidation = createPasswordValidator({
    PASSWORD_REQUIRED,
    PASSWORD_LENGTH_ERROR,
});

const refreshTokenValidation = body('refreshToken')
    .notEmpty()
    .withMessage(REFRESH_TOKEN_REQUIRED);

/**
 * Express-validator middleware array for the login endpoint.
 * Validates presence and format of email and password fields.
 */
export const loginValidation = [
    emailValidation,
    passwordValidation,
    body('deviceId')
        .optional({ values: 'null' })
        .isString()
        .withMessage(DEVICE_ID_INVALID),
];

export const refreshValidation = [refreshTokenValidation];

export const logoutValidation = [refreshTokenValidation];
