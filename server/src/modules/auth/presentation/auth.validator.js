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

const emailValidation = createEmailValidator({
    EMAIL_REQUIRED,
    EMAIL_INVALID,
});

const passwordValidation = createPasswordValidator({
    PASSWORD_REQUIRED,
    PASSWORD_LENGTH_ERROR,
});

/**
 * Express-validator middleware array for the login endpoint.
 * Validates presence and format of email and password fields.
 */
export const loginValidation = [emailValidation, passwordValidation];
