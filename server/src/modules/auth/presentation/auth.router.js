import express from 'express';
import { loginValidation, registerValidation } from './auth.validator.js';
import { validate } from '../../../shared/middleware/index.js';

export const createAuthRouter = ({
    authController,
    extraRegisterValidators = [],
}) => {
    const router = express.Router();

    router.post(
        '/register',
        ...extraRegisterValidators,
        registerValidation,
        validate,
        authController.register
    );

    router.post('/login', loginValidation, validate, authController.login);

    return router;
};
