import { body } from 'express-validator';

export const registerValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .bail()
        .isEmail().withMessage('Email must be valid')
        .normalizeEmail(),

    body('username')
        .notEmpty().withMessage('Username is required')
        .bail()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .bail()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    body('avatar')
        .optional({ values: 'null' })
        .isURL()
        .withMessage('Enter a valid avatar url'),

    body('bio')
        .optional({ values: 'null' })
        .isLength({ max: 190 })
        .withMessage('Bio should be maximum of 190 characters'),

    body('banner')
        .optional({ values: 'null' })
        .isURL()
        .withMessage('Enter a valid banner url'),

    body('bannerColor')
        .optional({ values: 'null' })
        .matches(/^#?(?:[0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/)
        .withMessage('Banner color must be a valid hex code'),

    body('dateOfBirth')
        .notEmpty().withMessage('Date-of-birth is required')
        .bail()
        .isISO8601()
        .withMessage('Enter a valid date (YYYY-MM-DD)'),

    body('isVerified')
        .optional({ values: 'null' })
        .isBoolean()
        .withMessage('is-verified must be a boolean'),

    body('status')
        .optional({ values: 'null' })
        .isIn(['online', 'offline', 'idle', 'dnd'])
        .withMessage('Status must be one of: online, offline, idle, dnd'),

    body('lastOnline')
        .optional({ values: 'null' })
        .isISO8601()
        .withMessage('Enter a valid date')
]
