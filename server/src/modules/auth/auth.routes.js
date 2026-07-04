import express from 'express';
import AuthController from './auth.controller.js';
import { loginValidation, registerValidation } from './auth.validator.js';
import validate from '../../middlewares/validate.middleware.js';

const makeAuthRouter = ({ loginUserUseCase, registerUserUseCase }) => {
    const router = express.Router();

    const authController = new AuthController({
        loginUserUseCase,
        registerUserUseCase,
    });

    router.post(
        '/register',
        registerValidation,
        validate,
        authController.register
    );
    router.post('/login', loginValidation, validate, authController.login);

    return router;
};

export default makeAuthRouter;
