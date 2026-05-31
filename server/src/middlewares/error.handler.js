import logger from '../utils/logger.js'
import ApiResponse from '../utils/api.response.js'

export const errorHandler = (err, req, res, _next) => {
    const statusCode = err.statusCode || 500
    const message = err.message

    logger.error(message, {
        statusCode,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        ip: req.ip
    })

    ApiResponse.error({ res, statusCode, message, errors: err.errors, stack: err.stack })
}
