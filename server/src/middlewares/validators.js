import { body, validationResult } from 'express-validator'

export const registerValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid Email is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
]

export const validate = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const error = new Error();
        error.statusCode = 400;
        error.error = errors.array();

        return next(error)
    }

    next()
}
