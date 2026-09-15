import { AppError, ErrorCode } from './app.error.js';

/**
 * Error thrown when a requested resource or endpoint cannot be found.
 */
export class NotFoundError extends AppError {
    /**
     * @param {string} message - Human-readable error description
     * @param {object|any[]} [errors] - Resource lookup details
     */
    constructor(message, errors) {
        super(message, ErrorCode.RESOURCE_NOT_FOUND, errors);
    }
}
