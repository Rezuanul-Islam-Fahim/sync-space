import { ApiResponse } from '../util/api-response.util.js';
import { AppError, ErrorCode } from '../error/app.error.js';
import {
    BAD_REQUEST,
    CONFLICT,
    INTERNAL_SERVER_ERROR,
    DEFAULT_ERROR,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
} from '../constant/index.js';
import {
    INVALID_ID,
    formatDuplicateFieldError,
} from '../infrastructure/database/database-error.constant.js';
import { isDev } from '../../config/index.js';

const errorCodeToHttpStatus = {
    [ErrorCode.BAD_REQUEST]: BAD_REQUEST,
    [ErrorCode.UNAUTHORIZED]: UNAUTHORIZED,
    [ErrorCode.FORBIDDEN]: FORBIDDEN,
    [ErrorCode.NOT_FOUND]: NOT_FOUND,
    [ErrorCode.CONFLICT]: CONFLICT,
};

// ── Mongoose / MongoDB error normalisers ─────────────────────────────────────

const handleValidationError = err => {
    const errors = Object.values(err.errors).reduce((acc, el) => {
        acc[el.path] = el.message;
        return acc;
    }, {});
    return new AppError(err.message, ErrorCode.BAD_REQUEST, errors);
};

const handleCastError = err =>
    new AppError(`${INVALID_ID}: ${err.value}`, ErrorCode.BAD_REQUEST);

const handleDuplicateKeyError = err => {
    const field = Object.keys(err.keyValue)[0];
    return new AppError(formatDuplicateFieldError(field), ErrorCode.CONFLICT);
};

const errorNormalizers = [
    {
        canHandle: err => err.name === 'ValidationError',
        handle: handleValidationError,
    },
    { canHandle: err => err.name === 'CastError', handle: handleCastError },
    { canHandle: err => err.code === 11000, handle: handleDuplicateKeyError },
];

// ── Main error handler ────────────────────────────────────────────────────────

export const makeErrorHandler = logger => (err, req, res, _next) => {
    // Normalise known infrastructure errors into operational AppErrors
    let error = err;

    for (const normalizer of errorNormalizers) {
        if (normalizer.canHandle(err)) {
            error = normalizer.handle(err);
            break;
        }
    }

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
