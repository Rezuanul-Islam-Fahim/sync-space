import { sendErrorResponse } from '../util/index.js';
import { getHttpStatusForErrorCode } from '../error/index.js';
import { INTERNAL_SERVER_ERROR, DEFAULT_ERROR } from '../constants/index.js';

// ── Main error handler ────────────────────────────────────────────────────────

export const makeErrorHandler = ({ logger, exposeStack = false }) => {
    return (err, req, res, _next) => {
        const error = err;

        const isOperational = Boolean(error.isOperational);
        const statusCode = isOperational
            ? error.statusCode || getHttpStatusForErrorCode(error.errorCode)
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

        sendErrorResponse({
            res,
            statusCode,
            message,
            errors: isOperational ? error.errors : undefined,
            stack: exposeStack ? error.stack : undefined,
        });
    };
};
