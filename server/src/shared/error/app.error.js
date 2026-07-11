export const ErrorCode = Object.freeze({
    INVALID_INPUT: 'INVALID_INPUT',
    UNAUTHENTICATED: 'UNAUTHENTICATED',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
});

export class AppError extends Error {
    constructor(message, errorCode, errors) {
        super(message);
        if (!Object.values(ErrorCode).includes(errorCode)) {
            throw new Error(`Invalid error code: ${errorCode}`);
        }
        this.errorCode = errorCode;
        this.errors = errors;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
