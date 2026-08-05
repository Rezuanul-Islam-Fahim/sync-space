import { TOKEN_VERIFICATION_FAILED } from '../auth-user.constant.js';

/**
 * Thrown by token-verification infrastructure adapters when a token is
 * invalid, expired, or cannot be verified.
 *
 * This error is handled and translated at the application layer boundary
 * (`AuthFacade`) into an appropriate `AppError` — keeping presentation layer
 * (middleware) decoupled from module internal error hierarchies.
 */
export class TokenVerificationError extends Error {
    constructor(message = TOKEN_VERIFICATION_FAILED) {
        super(message);
        this.name = 'TokenVerificationError';
    }
}
