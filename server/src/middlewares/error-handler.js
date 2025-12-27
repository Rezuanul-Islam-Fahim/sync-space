import { isDev } from '../config/index.js'
import logger from '../utils/logger.js'

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500

    logger.error(err.message, {
        statusCode,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        ip: req.ip
    })

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        errors: isDev() ? err.errors : undefined,
        stack: isDev() ? err.stack : undefined
    })
}
