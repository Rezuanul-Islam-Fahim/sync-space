import { DEFAULT_SUCCESS } from '../../constants/app-messages.constant.js';

export default class ApiResponse {
    static success({ res, data, statusCode, message = DEFAULT_SUCCESS }) {
        return res.status(statusCode).json({ statusCode, data, message });
    }

    static error({ res, statusCode, message, errors, stack }) {
        return res.status(statusCode).json({
            statusCode,
            message,
            errors,
            stack,
        });
    }
}
