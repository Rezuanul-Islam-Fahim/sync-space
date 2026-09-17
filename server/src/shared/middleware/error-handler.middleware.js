import { sendErrorResponse } from '../util/index.js';
import { ErrorCode } from '../error/index.js';
import {
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    CONFLICT,
    INTERNAL_SERVER_ERROR,
    TIMED_OUT,
    DEFAULT_ERROR,
} from '../constants/index.js';

/**
 * Default immutable mapping from ErrorCode to HTTP status codes.
 * @type {Readonly<Record<string, number>>}
 */
export const DEFAULT_ERROR_STATUS_MAP = Object.freeze({
    [ErrorCode.INVALID_INPUT]: BAD_REQUEST,
    [ErrorCode.UNAUTHENTICATED]: UNAUTHORIZED,
    [ErrorCode.PERMISSION_DENIED]: FORBIDDEN,
    [ErrorCode.RESOURCE_NOT_FOUND]: NOT_FOUND,
    [ErrorCode.TIMED_OUT]: TIMED_OUT,
    [ErrorCode.ALREADY_EXISTS]: CONFLICT,
    [ErrorCode.INTERNAL_ERROR]: INTERNAL_SERVER_ERROR,
});

/**
 * Resolves the HTTP status code for a given error code.
 *
 * @param {string} code
 * @param {Record<string, number>} [statusMap]
 * @returns {number}
 */
export const getHttpStatusForErrorCode = (
    code,
    statusMap = DEFAULT_ERROR_STATUS_MAP
) => {
    return statusMap[code] || INTERNAL_SERVER_ERROR;
};

// ── Main error handler ────────────────────────────────────────────────────────

/**
 * Creates the global Express error-handling middleware.
 *
 * @param {{
 *   logger: import('../ports/index.js').LoggerPort,
 *   exposeStack?: boolean,
 *   customErrorMap?: Record<string, number>
 * }} options
 * @returns {import('express').ErrorRequestHandler}
 */
export const makeErrorHandler = ({
    logger,
    exposeStack = false,
    customErrorMap = {},
}) => {
    const errorStatusMap = Object.freeze({
        ...DEFAULT_ERROR_STATUS_MAP,
        ...customErrorMap,
    });

    return (err, req, res, _next) => {
        const error = err;

        const isOperational = Boolean(error.isOperational);
        const errorCode =
            isOperational && error.errorCode
                ? error.errorCode
                : ErrorCode.INTERNAL_ERROR;
        const statusCode = isOperational
            ? getHttpStatusForErrorCode(errorCode, errorStatusMap)
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
