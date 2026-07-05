import logger from '../../infrastructure/logging/logger.js';
import ApiResponse from '../responses/api.response.js';
import AppError from '../errors/app.error.js';
import {
    BAD_REQUEST,
    CONFLICT,
    INTERNAL_SERVER_ERROR,
} from '../../constants/http-status.constant.js';
import {
    DEFAULT_ERROR,
    DUPLICATE_FIELD_VALUE,
    INVALID_ID,
} from '../../constants/app-messages.constant.js';
import { isDev } from '../../config/index.js';

// ── Mongoose / MongoDB error normalisers ─────────────────────────────────────

const handleValidationError = err => {
    const errors = Object.values(err.errors).reduce((acc, el) => {
        acc[el.path] = el.message;
        return acc;
    }, {});
    return new AppError(err.message, BAD_REQUEST, errors);
};

const handleCastError = err =>
    new AppError(`${INVALID_ID}: ${err.value}`, BAD_REQUEST);

const handleDuplicateKeyError = err => {
    const field = Object.keys(err.keyValue)[0];
    return new AppError(DUPLICATE_FIELD_VALUE(field), CONFLICT);
};

// ── Main error handler ────────────────────────────────────────────────────────

export const errorHandler = (err, req, res, _next) => {
    // Normalise known infrastructure errors into operational AppErrors
    let error = err;

    if (err.name === 'ValidationError') error = handleValidationError(err);
    else if (err.name === 'CastError') error = handleCastError(err);
    else if (err.code === 11000) error = handleDuplicateKeyError(err);

    const isOperational = error.isOperational;
    const statusCode = isOperational
        ? error.statusCode || INTERNAL_SERVER_ERROR
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
        requestId,
        stack: isDev() ? error.stack : undefined,
    });
};
