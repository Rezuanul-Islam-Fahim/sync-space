import { authRegisterValidation } from '../../../modules/auth/index.js';
import { userProfileValidation } from '../../../modules/user/index.js';

export const compositeRegistrationValidation = [
    ...authRegisterValidation,
    ...userProfileValidation,
];
