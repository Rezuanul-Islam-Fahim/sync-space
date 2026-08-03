import { ApiResponse } from '../util/index.js';
import { ErrorCode } from '../error/index.js';
import {
    BAD_REQUEST,
    CONFLICT,
    INTERNAL_SERVER_ERROR,
    DEFAULT_ERROR,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
} from '../constants/index.js';
import { isDev } from '../../config/index.js';

const errorCodeToHttpStatus = {
    [ErrorCode.INVALID_INPUT]: BAD_REQUEST,
    [ErrorCode.UNAUTHENTICATED]: UNAUTHORIZED,
    [ErrorCode.PERMISSION_DENIED]: FORBIDDEN,
    [ErrorCode.RESOURCE_NOT_FOUND]: NOT_FOUND,
    [ErrorCode.ALREADY_EXISTS]: CONFLICT,
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

        if (!isOperational) {
            // Trigger a graceful shutdown for unhandled non-operational errors
            process.emit('criticalError', error);
        }
    };
};
