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
export const createAuthRouter = ({ authController, authenticate }) => {
    const router = express.Router();

    router.post('/login', loginValidation, validate, authController.login);
    router.post(
        '/refresh',
        authenticate,
        refreshValidation,
        validate,
        authController.tokenRefresh
    );
    router.post(
        '/logout',
        authenticate,
        logoutValidation,
        validate,
        authController.logout
    );

    return router;
};
