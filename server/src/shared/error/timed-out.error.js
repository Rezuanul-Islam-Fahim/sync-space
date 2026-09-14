import { AppError, ErrorCode } from './app.error.js';

/**
 * Error thrown when a request failed to deliver a response within the expected time
 */
export class TimedOutError extends AppError {
    /**
     * @param {string} message - Human-readable error description
     * @param {object|any[]} [errors] - Resource lookup details
     */
    constructor(message, errors) {
        super(message, ErrorCode.TIMED_OUT, errors);
    }
}
