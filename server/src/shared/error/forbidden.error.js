import { AppError, ErrorCode } from './app.error.js';

/**
 * Error thrown when an authenticated principal lacks required permissions for an operation.
 */
export class ForbiddenError extends AppError {
    /**
     * @param {string} message - Human-readable error description
     * @param {object|array} [errors] - Authorization failure details
     */
    constructor(message, errors) {
        super(message, ErrorCode.PERMISSION_DENIED, errors);
    }
}
