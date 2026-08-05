import { validationResult } from 'express-validator';
import { BadRequestError } from '../error/index.js';

/**
 * Middleware that inspects express-validator results.
 * Formats errors into a clean, framework-agnostic payload ({ field, message }).
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorArray = errors.array();

        const formattedErrors = errorArray.map(err => ({
            field: err.path || err.param || 'unknown',
            message: err.msg,
        }));

        const messageStr = errorArray.map(obj => `${obj.msg}.`).join(' ');

        const error = new BadRequestError(messageStr, formattedErrors);

        return next(error);
    }

    next();
};
