import { validationResult } from 'express-validator';
import { AppError, ErrorCode } from '../error/app.error.js';

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const messageStr = errors
            .array()
            .map(obj => `${obj.msg}.`)
            .join(' ');
        const error = new AppError(
            messageStr,
            ErrorCode.BAD_REQUEST,
            errors.array()
        );

        return next(error);
    }

    next();
};
