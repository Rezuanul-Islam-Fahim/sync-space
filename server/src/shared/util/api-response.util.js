import {
    DEFAULT_SUCCESS,
    OK,
    INTERNAL_SERVER_ERROR,
} from '../constants/index.js';

/**
 * Sends a standardized success JSON response.
 *
 * @param {{
 *   res: import('express').Response,
 *   data?: any,
 *   statusCode?: number,
 *   message?: string
 * }} options
 */
export const sendSuccessResponse = ({
    res,
    data,
    statusCode = OK,
    message = DEFAULT_SUCCESS,
}) => {
    const response = {
        statusCode,
        message,
    };

    if (data !== undefined) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Sends a standardized error JSON response.
 *
 * @param {{
 *   res: import('express').Response,
 *   statusCode?: number,
 *   message: string,
 *   errorCode?: string,
 *   errors?: any,
 *   requestId?: string,
 *   stack?: string
 * }} options
 */
export const sendErrorResponse = ({
    res,
    statusCode = INTERNAL_SERVER_ERROR,
    message,
    errorCode,
    errors,
    requestId,
    stack,
}) => {
    const response = {
        statusCode,
        message,
    };

    if (errorCode !== undefined) {
        response.errorCode = errorCode;
    }
    if (errors !== undefined) {
        response.errors = errors;
    }
    if (requestId !== undefined) {
        response.requestId = requestId;
    }
    if (stack !== undefined) {
        response.stack = stack;
    }

    return res.status(statusCode).json(response);
};
