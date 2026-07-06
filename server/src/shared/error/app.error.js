export const ErrorCode = Object.freeze({
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
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
