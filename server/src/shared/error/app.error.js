import {
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    CONFLICT,
    INTERNAL_SERVER_ERROR,
} from '../constants/index.js';

export const ErrorCode = Object.freeze({
    INVALID_INPUT: 'INVALID_INPUT',
    UNAUTHENTICATED: 'UNAUTHENTICATED',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
});

// Dynamic registry mapping error code strings to HTTP status codes
const errorCodeRegistry = new Map([
    [ErrorCode.INVALID_INPUT, BAD_REQUEST],
    [ErrorCode.UNAUTHENTICATED, UNAUTHORIZED],
    [ErrorCode.PERMISSION_DENIED, FORBIDDEN],
    [ErrorCode.RESOURCE_NOT_FOUND, NOT_FOUND],
    [ErrorCode.ALREADY_EXISTS, CONFLICT],
    [ErrorCode.INTERNAL_ERROR, INTERNAL_SERVER_ERROR],
]);

/**
 * Resolves the HTTP status code for a given error code.
 *
 * @param {string} code
 * @returns {number}
 */

export const getHttpStatusForErrorCode = code => {
    return errorCodeRegistry.get(code) || INTERNAL_SERVER_ERROR;
};

/**
 * Extensible Base Application Error.
 */
export class AppError extends Error {
    /**
     * @param {string} message - Human-readable error message
     * @param {string} [errorCode] - Error code string (e.g. 'INVALID_INPUT')
     * @param {object|array} [errors] - Optional detailed validation error payload
     * @param {number} [statusCode] - Optional explicit HTTP status override
     */
    constructor(
        message,
        errorCode = ErrorCode.INTERNAL_ERROR,
        errors = undefined,
        statusCode = undefined
    ) {
        super(message);
        this.errorCode = errorCode;
        this.errors = errors;
        this.statusCode = statusCode || getHttpStatusForErrorCode(errorCode);
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
