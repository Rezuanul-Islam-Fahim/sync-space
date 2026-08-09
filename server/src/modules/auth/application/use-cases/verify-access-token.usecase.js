import { AppError, ErrorCode } from '../../../../shared/error/index.js';
import {
    INVALID_TOKEN,
    TOKEN_EXPIRED,
} from '../../domain/auth-user.constant.js';
import { TokenVerificationError } from '../../domain/errors/token-verification.error.js';

export class VerifyAccessTokenUseCase {
    /**
     * @param {{
     *   tokenVerifier: import('../ports/token-verifier.port.js').TokenVerifierPort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ tokenVerifier, logger }) {
        this.tokenVerifier = tokenVerifier;
        this.logger = logger;
    }

    /**
     * Verifies access token and maps payload to an intent-revealing principal object.
     *
     * @param {string} token
     * @returns {Promise<{ id: string, email: string }>}
     * @throws {AppError} if token is invalid or verification fails
     */
    async execute(token) {
        try {
            const decoded = await this.tokenVerifier.verifyAccessToken(token);
            return { id: decoded.sub, email: decoded.email };
        } catch (error) {
            if (error instanceof TokenVerificationError) {
                const message = error.isExpired ? TOKEN_EXPIRED : INVALID_TOKEN;
                throw new AppError(message, ErrorCode.UNAUTHENTICATED);
            }
            throw error;
        }
    }
}
