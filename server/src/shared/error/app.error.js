export const ErrorCode = Object.freeze({
    INVALID_INPUT: 'INVALID_INPUT',
    UNAUTHENTICATED: 'UNAUTHENTICATED',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
});

/**
 * Extensible Base Application Error.
 */
export class AppError extends Error {
    /**
     * @param {string} message - Human-readable error message
     * @param {string} [errorCode] - Error code string (e.g. 'INVALID_INPUT')
     * @param {object|array} [errors] - Optional detailed validation error payload
     */
    constructor(
        message,
        errorCode = ErrorCode.INTERNAL_ERROR,
        errors = undefined
    ) {
        super(message);
        this.name = this.constructor.name;
        this.errorCode = errorCode;
        this.errors = errors;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
