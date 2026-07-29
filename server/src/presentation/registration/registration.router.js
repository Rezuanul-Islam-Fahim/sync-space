import express from 'express';
import { validate } from '../../shared/middleware/index.js';
import { registrationValidation } from './registration.validator.js';

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
