import { sendErrorResponse } from '../util/index.js';
import { getHttpStatusForErrorCode, ErrorCode } from '../error/index.js';
import { INTERNAL_SERVER_ERROR, DEFAULT_ERROR } from '../constants/index.js';

// ── Main error handler ────────────────────────────────────────────────────────

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

        logger.error(error.message, {
            statusCode,
            errorCode,
            stack: error.stack,
            isOperational,
            requestId,
            path: req.originalUrl,
            method: req.method,
            ip: req.ip,
        });

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
