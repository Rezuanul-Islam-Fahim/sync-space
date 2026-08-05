import { CONFLICT } from '../constants/index.js';
import { AppError, ErrorCode } from './app.error.js';

export class ConflictError extends AppError {
    constructor(message, errors) {
        super(message, ErrorCode.ALREADY_EXISTS, errors, CONFLICT);
    }
}
