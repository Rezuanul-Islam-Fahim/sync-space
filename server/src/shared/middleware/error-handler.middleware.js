import { sendErrorResponse } from '../util/index.js';
import { ErrorCode } from '../error/index.js';
import {
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    CONFLICT,
    INTERNAL_SERVER_ERROR,
    DEFAULT_ERROR,
} from '../constants/index.js';

// Dynamic registry mapping error code strings to HTTP status codes
const errorCodeRegistry = new Map([
    [ErrorCode.INVALID_INPUT, BAD_REQUEST],
    [ErrorCode.UNAUTHENTICATED, UNAUTHORIZED],
    [ErrorCode.PERMISSION_DENIED, FORBIDDEN],
    [ErrorCode.RESOURCE_NOT_FOUND, NOT_FOUND],
    [ErrorCode.ALREADY_EXISTS, CONFLICT],
    [ErrorCode.INTERNAL_ERROR, INTERNAL_SERVER_ERROR],
]);

/**
 * Resolves the HTTP status code for a given error code.
 *
 * @param {string} code
 * @returns {number}
 */
export const getHttpStatusForErrorCode = code => {
    return errorCodeRegistry.get(code) || INTERNAL_SERVER_ERROR;
};

// ── Main error handler ────────────────────────────────────────────────────────

/**
 * Creates the global Express error-handling middleware.
 *
 * @param {{
 *   logger: import('../ports/index.js').LoggerPort,
 *   exposeStack?: boolean
 * }} options
 * @returns {import('express').ErrorRequestHandler}
 */
export const makeErrorHandler = ({ logger, exposeStack = false }) => {
    return (err, req, res, _next) => {
        const error = err;

        const isOperational = Boolean(error.isOperational);
        const errorCode =
            isOperational && error.errorCode
                ? error.errorCode
                : ErrorCode.INTERNAL_ERROR;
        const statusCode = isOperational
            ? error.statusCode || getHttpStatusForErrorCode(errorCode)
            : INTERNAL_SERVER_ERROR;
        const message = isOperational ? error.message : DEFAULT_ERROR;
        const requestId = req.id;

        const logPayload = {
            statusCode,
            errorCode,
            isOperational,
            requestId,
            clientRequestId: req.clientRequestId,
            path: req.originalUrl,
            method: req.method,
            ip: req.ip,
        };

        if (isOperational) {
            logger.warn(error.message, logPayload);
        } else {
            logger.error(error.message, {
                ...logPayload,
                stack: error.stack,
            });
        }

        sendErrorResponse({
            res,
            statusCode,
            message,
            errorCode,
            errors: isOperational ? error.errors : undefined,
            requestId,
            stack: exposeStack ? error.stack : undefined,
        });
    };
};
