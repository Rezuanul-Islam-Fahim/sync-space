import express from 'express';
import { validate } from '../../../shared/middleware/index.js';
import { compositeRegistrationValidation } from './registration.validator.js';

export const createRegistrationRouter = ({ registrationController }) => {
    const router = express.Router();

    router.post(
        '/',
        ...compositeRegistrationValidation,
        validate,
        registrationController.register
    );

    return router;
};
