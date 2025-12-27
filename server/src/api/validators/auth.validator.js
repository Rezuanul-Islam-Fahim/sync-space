import { body } from "express-validator";

export const registerValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid Email is required'),
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username is required and must be between 3 and 30 characters'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    body('dateOfBirth')
        .isISO8601()
        .toDate()
        .withMessage('Valid Date of Birth is required (YYYY-MM-DD)')
]
