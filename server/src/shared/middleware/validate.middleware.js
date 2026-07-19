import { validationResult } from 'express-validator';
import { AppError, ErrorCode } from '../error/index.js';

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const messageStr = errors
            .array()
            .map(obj => `${obj.msg}.`)
            .join(' ');
        const error = new AppError(
            messageStr,
            ErrorCode.INVALID_INPUT,
            errors.array()
        );

        return next(error);
    }

    next();
};
