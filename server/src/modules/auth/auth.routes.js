import express from 'express';
import { loginValidation, registerValidation } from './auth.validator.js';
import validate from '../../middlewares/validate.middleware.js';

const makeAuthRouter = ({ authController }) => {
    const router = express.Router();

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
