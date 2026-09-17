import express from 'express';
import { validate } from '../../../shared/middleware/index.js';
import { registrationValidation } from './registration.validator.js';

/**
 * Creates the registration Express router.
 *
 * @param {{ registrationController: import('./registration.controller.js').RegistrationController }} deps
 * @returns {import('express').Router}
 */
export const createRegistrationRouter = ({ registrationController }) => {
    const router = express.Router();

    router.post(
        '/',
        registrationValidation,
        validate,
        registrationController.register
    );

    return router;
};
