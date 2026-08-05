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
    return res.status(statusCode).json({ statusCode, data, message });
};

/**
 * Sends a standardized error JSON response.
 *
 * @param {{
 *   res: import('express').Response,
 *   statusCode?: number,
 *   message: string,
 *   errors?: any,
 *   stack?: string
 * }} options
 */
export const sendErrorResponse = ({
    res,
    statusCode = INTERNAL_SERVER_ERROR,
    message,
    errors,
    stack,
}) => {
    return res.status(statusCode).json({
        statusCode,
        message,
        errors,
        stack,
    });
};
