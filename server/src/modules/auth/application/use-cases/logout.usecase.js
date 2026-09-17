import { UnauthorizedError } from '../../../../shared/error/unauthorized.error.js';
import { maskEmail } from '../../../../shared/util/index.js';
import { INVALID_TOKEN } from '../../domain/auth-user.constant.js';
import {
    TokenExpiredError,
    TokenInvalidError,
    TokenVerificationError,
} from '../errors/token-verification.error.js';

/**
 * Use case for logging out a user, clearing their refresh token session, and blacklisting the access token.
 */
export class LogoutUseCase {
    /**
     * @param {{
     *   tokenVerifier: import('../ports/token-verifier.port.js').TokenVerifierPort,
     *   sessionStore: import('../ports/session-store.port.js').SessionStorePort,
     *   tokenBlacklist: import('../ports/token-blacklist.port.js').TokenBlacklistPort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ tokenVerifier, sessionStore, tokenBlacklist, logger }) {
        this.tokenVerifier = tokenVerifier;
        this.sessionStore = sessionStore;
        this.tokenBlacklist = tokenBlacklist;
        this.logger = logger;
    }

    /**
     * Executes the logout operation.
     *
     * @param {{ refreshToken: string, accessToken?: string }} data
     * @returns {Promise<void>}
     */
    async execute(data) {
        try {
            const {
                sub: authUserId,
                email,
                sessionId,
            } = await this.tokenVerifier.verifyRefreshToken(data.refreshToken);

            const session = await this.sessionStore.getSession(
                authUserId,
                sessionId
            );

            if (session) {
                await this.sessionStore.deleteSession(authUserId, sessionId);

                if (data.accessToken) {
                    try {
                        const { jti, exp } =
                            await this.tokenVerifier.verifyAccessToken(
                                data.accessToken
                            );

                        const ttl = Math.max(
                            1,
                            exp - Math.floor(Date.now() / 1000)
                        );

                        await this.tokenBlacklist.blacklistToken(jti, ttl);
                    } catch (error) {
                        if (!(error instanceof TokenVerificationError)) {
                            throw error;
                        }
                    }
                }

                this.logger.info('Session cleared successfully', {
                    authUserId,
                    email: maskEmail(email),
                });
            }
        } catch (error) {
            if (error instanceof TokenInvalidError) {
                throw new UnauthorizedError(INVALID_TOKEN);
            } else if (!(error instanceof TokenExpiredError)) {
                throw error;
            }
            // Intentionally ignore TokenExpiredError: users should be allowed to
            // log out and clear their local session state even if the refresh token has expired.
        }
    }
}
