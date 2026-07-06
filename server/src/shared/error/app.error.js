export class AppError extends Error {
    constructor(message, errorCode, errors) {
        super(message);

        this.errorCode = errorCode;
        this.errors = errors;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
