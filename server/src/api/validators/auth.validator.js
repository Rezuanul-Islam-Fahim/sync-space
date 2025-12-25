import { body } from "express-validator";

export const registerValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid Email is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
]
