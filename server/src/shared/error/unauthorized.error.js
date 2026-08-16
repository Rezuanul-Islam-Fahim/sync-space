import { AppError, ErrorCode } from './app.error.js';

/**
 * Error thrown when authentication credentials are missing, invalid, or expired.
 */
export class UnauthorizedError extends AppError {
    /**
     * @param {string} message - Human-readable error description
     * @param {object|array} [errors] - Authentication failure details
     */
    constructor(message, errors) {
        super(message, ErrorCode.UNAUTHENTICATED, errors);
    }
}
