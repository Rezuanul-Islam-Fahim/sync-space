import { ApiResponse } from '../util/api-response.util.js';
import { ErrorCode } from '../error/app.error.js';
import {
    BAD_REQUEST,
    CONFLICT,
    INTERNAL_SERVER_ERROR,
    DEFAULT_ERROR,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
} from '../constant/index.js';
import { isDev } from '../../config/index.js';

const errorCodeToHttpStatus = {
    [ErrorCode.BAD_REQUEST]: BAD_REQUEST,
    [ErrorCode.UNAUTHORIZED]: UNAUTHORIZED,
    [ErrorCode.FORBIDDEN]: FORBIDDEN,
    [ErrorCode.NOT_FOUND]: NOT_FOUND,
    [ErrorCode.CONFLICT]: CONFLICT,
};

// ── Main error handler ────────────────────────────────────────────────────────

export const makeErrorHandler = logger => {
    return (err, req, res, _next) => {
        const error = err;

        const isOperational = error.isOperational;
        const statusCode = isOperational
            ? errorCodeToHttpStatus[error.errorCode] || INTERNAL_SERVER_ERROR
            : INTERNAL_SERVER_ERROR;
        const message = isOperational ? error.message : DEFAULT_ERROR;
        const requestId = req.id;

        logger.error(error.message, {
            statusCode,
            stack: error.stack,
            isOperational,
            requestId,
            path: req.originalUrl,
            method: req.method,
            ip: req.ip,
        });

        ApiResponse.error({
            res,
            statusCode,
            message,
            errors: isOperational ? error.errors : undefined,
            stack: isDev() ? error.stack : undefined,
        });
    };
};
