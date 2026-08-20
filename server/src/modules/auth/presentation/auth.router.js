import express from 'express';
import { loginValidation } from './auth.validator.js';
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

    return router;
};
