import { AppError, ErrorCode } from '../error/app.error.js';

export const unknownRoutesHandler = (req, res, next) => {
    next(
        new AppError(`Route: ${req.originalUrl} not found`, ErrorCode.NOT_FOUND)
    );
};
