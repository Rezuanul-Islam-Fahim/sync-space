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

export const loginValidation = [emailValidation, passwordValidation];
