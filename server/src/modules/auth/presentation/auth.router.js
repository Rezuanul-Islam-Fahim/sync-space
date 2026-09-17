import express from 'express';
import {
    loginValidation,
    logoutValidation,
    refreshValidation,
} from './auth.validator.js';
import { validate } from '../../../shared/middleware/index.js';

/**
 * Creates the auth Express router.
 *
 * @param {{ authController: import('./auth.controller.js').AuthController }} deps
 * @returns {import('express').Router}
 */
export const createAuthRouter = ({ authController }) => {
    const router = express.Router();

    router.post('/login', loginValidation, validate, authController.login);
    router.post(
        '/refresh',
        refreshValidation,
        validate,
        authController.tokenRefresh
    );
    router.post('/logout', logoutValidation, validate, authController.logout);

    return router;
};
