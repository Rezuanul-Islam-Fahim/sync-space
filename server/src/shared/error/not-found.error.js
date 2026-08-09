import { AppError, ErrorCode } from './app.error.js';

export class NotFoundError extends AppError {
    constructor(message, errors) {
        super(message, ErrorCode.RESOURCE_NOT_FOUND, errors);
    }
}
