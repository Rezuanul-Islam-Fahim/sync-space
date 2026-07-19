import express from 'express';
import { loginValidation } from './auth.validator.js';
import { validate } from '../../../shared/middleware/index.js';

export const createAuthRouter = ({ authController }) => {
    const router = express.Router();

    router.post('/login', loginValidation, validate, authController.login);

    return router;
};
