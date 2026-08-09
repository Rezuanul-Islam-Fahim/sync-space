import { AppError, ErrorCode } from './app.error.js';

export class BadRequestError extends AppError {
    constructor(message, errors) {
        super(message, ErrorCode.INVALID_INPUT, errors);
    }
}
