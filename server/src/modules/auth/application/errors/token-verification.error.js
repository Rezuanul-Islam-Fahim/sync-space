import { AppError, ErrorCode } from '../../../../shared/error/index.js';
import {
    TOKEN_VERIFICATION_FAILED,
    INVALID_TOKEN,
    TOKEN_EXPIRED,
} from '../../domain/auth-user.constant.js';

/**
 * Thrown by token verification operations when a token is invalid,
 * expired, or cannot be verified.
 *
 * Defined in the application layer as a contract for TokenVerifierPort
 * implementations, preserving the Dependency Inversion Principle.
 */
export class TokenVerificationError extends AppError {
    constructor(message = TOKEN_VERIFICATION_FAILED, cause = null) {
        super(message, ErrorCode.UNAUTHENTICATED);
        this.name = 'TokenVerificationError';
        this.cause = cause;
        this.isExpired = false;
    }
}

export class TokenExpiredError extends TokenVerificationError {
    constructor(message = TOKEN_EXPIRED, cause = null) {
        super(message, cause);
        this.name = 'TokenExpiredError';
        this.isExpired = true;
    }
}

export class TokenInvalidError extends TokenVerificationError {
    constructor(message = INVALID_TOKEN, cause = null) {
        super(message, cause);
        this.name = 'TokenInvalidError';
        this.isExpired = false;
    }
}
