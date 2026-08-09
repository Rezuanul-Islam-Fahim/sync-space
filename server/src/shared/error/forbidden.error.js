import { AppError, ErrorCode } from './app.error.js';

export class ForbiddenError extends AppError {
    constructor(message, errors) {
        super(message, ErrorCode.PERMISSION_DENIED, errors);
    }
}
