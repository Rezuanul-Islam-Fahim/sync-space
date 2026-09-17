import { AppError, ErrorCode } from './app.error.js';

/**
 * Error thrown when a resource already exists or a conflict occurs.
 */
export class ConflictError extends AppError {
    /**
     * @param {string} message - Human-readable error description
     * @param {object|any[]} [errors] - Conflict error details
     */
    constructor(message, errors) {
        super(message, ErrorCode.ALREADY_EXISTS, errors);
    }
}
