import { AppError, ErrorCode } from './app.error.js';

/**
 * Error thrown when input validation fails or client supplies invalid request payload.
 */
export class BadRequestError extends AppError {
    /**
     * @param {string} message - Human-readable error description
     * @param {object|array} [errors] - Validation failure details
     */
    constructor(message, errors) {
        super(message, ErrorCode.INVALID_INPUT, errors);
    }
}
