import express from 'express';
import { validate } from '../../shared/middleware/index.js';
import { authRegisterValidation } from '../../modules/auth/index.js';
import { userProfileValidation } from '../../modules/user/presentation/user.validator.js';

export const createRegistrationRouter = ({ registrationController }) => {
    const router = express.Router();

    router.post(
        '/',
        ...authRegisterValidation,
        ...userProfileValidation,
        validate,
        registrationController.register
    );

    return router;
};
