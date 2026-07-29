import { authRegisterValidation } from '../../auth/index.js';
import { userProfileValidation } from '../../user/index.js';

export const registrationValidation = [
    ...authRegisterValidation,
    ...userProfileValidation,
];
