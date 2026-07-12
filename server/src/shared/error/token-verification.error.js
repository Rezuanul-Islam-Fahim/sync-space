/**
 * Thrown by token-verification infrastructure adapters when a token is
 * invalid, expired, or cannot be verified.
 *
 * This is an infrastructure-layer error whose contract is defined by the
 * `TokenVerifierPort`.  Application-layer consumers (e.g. middleware) are
 * responsible for catching it and translating it into the appropriate
 * `AppError` — keeping infrastructure isolated from application error types.
 */
export class TokenVerificationError extends Error {
    constructor(message = 'Token verification failed') {
        super(message);
        this.name = 'TokenVerificationError';
    }
}
