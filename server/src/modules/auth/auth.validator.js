import { body } from 'express-validator';
import { REGISTER_ALLOWED_FIELDS } from './auth.constant.js';

const registerAllowedFieldsValidation = body().custom(payload => {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('Request body must be an object');
    }

    const unknownFields = Object.keys(payload).filter(key => {
        return !REGISTER_ALLOWED_FIELDS.includes(key);
    });

    if (unknownFields.length > 0) {
        throw new Error('Unknown field(s): ' + unknownFields.join(', '));
    }

    return true;
});

export const registerValidation = [
    registerAllowedFieldsValidation,

    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Email must be valid')
        .normalizeEmail(),

    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .bail()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .bail()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('displayName')
        .optional({ values: 'null' })
        .isString()
        .withMessage('Display Name must be a valid string'),

    body('dateOfBirth')
        .notEmpty()
        .withMessage('Date-of-birth is required')
        .bail()
        .isISO8601()
        .withMessage('Enter a valid date (YYYY-MM-DD)'),
];
