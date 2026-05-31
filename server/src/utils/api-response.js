import { isDev } from '../config/index.js'

export default class ApiResponse {
    static success({ res, data, statusCode, message = 'OK' }) {
        return res.status(statusCode).json({ success: true, data, message })
    }

    static error({ res, statusCode, message = 'Internal Server Error', errors, stack }) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors: isDev() ? errors : undefined,
            stack: isDev() ? stack : undefined
        })
    }
}
