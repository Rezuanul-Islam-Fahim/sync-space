import logger from '../../infrastructure/logger/logger.js';
import ApiResponse from '../responses/api.response.js';
import { INTERNAL_SERVER_ERROR } from '../../constants/http-status.constant.js';
import { DEFAULT_ERROR } from '../../constants/app-messages.constant.js';
import { isDev } from '../../config/index.js';

export const errorHandler = (err, req, res, _next) => {
    const isOperational = err.isOperational;
    const statusCode = isOperational
        ? err.statusCode || INTERNAL_SERVER_ERROR
        : INTERNAL_SERVER_ERROR;
    const message = isOperational ? err.message : DEFAULT_ERROR;
    const requestId = req.id;

    logger.error(err.message, {
        statusCode,
        stack: err.stack,
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
        errors: isOperational ? err.errors : undefined,
        stack: isDev() ? err.stack : undefined,
    });
};
