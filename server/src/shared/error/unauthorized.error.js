import { UNAUTHORIZED } from '../constants/index.js';
import { AppError, ErrorCode } from './app.error.js';

export class UnauthorizedError extends AppError {
    constructor(message, errors) {
        super(message, ErrorCode.UNAUTHENTICATED, errors, UNAUTHORIZED);
    }
}
