import {
    DEFAULT_SUCCESS,
    OK,
    INTERNAL_SERVER_ERROR,
} from '../constants/index.js';

export class ApiResponse {
    static success({ res, data, statusCode = OK, message = DEFAULT_SUCCESS }) {
        return res.status(statusCode).json({ statusCode, data, message });
    }

    static error({
        res,
        statusCode = INTERNAL_SERVER_ERROR,
        message,
        errors,
        stack,
    }) {
        return res.status(statusCode).json({
            statusCode,
            message,
            errors,
            stack,
        });
    }
}
