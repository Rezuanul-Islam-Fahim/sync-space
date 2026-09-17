import { UnauthorizedError } from '../../../../shared/error/unauthorized.error.js';
import { maskEmail } from '../../../../shared/util/index.js';
import { INVALID_TOKEN } from '../../domain/auth-user.constant.js';
import {
    TokenExpiredError,
    TokenInvalidError,
    TokenVerificationError,
} from '../../infrastructure/security/errors/token-verification.error.js';

/**
 * Use case for logging out a user, clearing their refresh token session, and blacklisting the access token.
 */
export class LogoutUseCase {
    /**
     * @param {{
     *   tokenVerifier: import('../ports/token-verifier.port.js').TokenVerifierPort,
     *   sessionReader: import('../ports/session-reader.port.js').SessionReaderPort,
     *   sessionWriter: import('../ports/session-writer.port.js').SessionWriterPort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ tokenVerifier, sessionReader, sessionWriter, logger }) {
        this.tokenVerifier = tokenVerifier;
        this.sessionReader = sessionReader;
        this.sessionWriter = sessionWriter;
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

            const session = await this.sessionReader.getSession(
                authUserId,
                sessionId
            );

            if (session) {
                await this.sessionWriter.clearSession(authUserId, sessionId);

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

                        await this.sessionWriter.blacklistLoginSession(
                            jti,
                            ttl
                        );
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
        }
    }
}
