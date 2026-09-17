import { randomUUID } from 'node:crypto';
import {
    TimedOutError,
    UnauthorizedError,
} from '../../../../shared/error/index.js';
import { maskEmail, waitedResponse } from '../../../../shared/util/index.js';
import {
    SESSION_EXPIRED_INVALID,
    TOKEN_EXPIRED,
    INVALID_TOKEN,
    USER_UNAVAILABLE,
    TOKEN_REFRESH_TIMEOUT,
    GET_CACHED_SESSION_WAITING_TIME,
    GET_CACHED_SESSION_POLLING_INTERVAL,
} from '../../domain/auth-user.constant.js';
import { TokenVerificationError } from '../../infrastructure/security/errors/token-verification.error.js';

/**
 * Use case for refreshing authentication tokens and managing session lifecycle.
 */
export class TokenRefreshUseCase {
    /**
     * @param {{
     *   authUserReader: import('../ports/auth-user-reader.port.js').AuthUserReaderPort,
     *   tokenGenerator: import('../ports/token-generator.port.js').TokenGeneratorPort,
     *   tokenVerifier: import('../ports/token-verifier.port.js').TokenVerifierPort,
     *   sessionReader: import('../ports/session-reader.port.js').SessionReaderPort,
     *   sessionWriter: import('../ports/session-writer.port.js').SessionWriterPort,
     *   tokenHasher: import('../ports/token-hasher.port.js').TokenHasherPort,
     *   tokenHashComparer: import('../ports/token-hasher.port.js').TokenHashComparerPort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({
        authUserReader,
        tokenGenerator,
        tokenVerifier,
        sessionReader,
        sessionWriter,
        tokenHasher,
        tokenHashComparer,
        logger,
    }) {
        this.authUserReader = authUserReader;
        this.tokenGenerator = tokenGenerator;
        this.tokenVerifier = tokenVerifier;
        this.sessionReader = sessionReader;
        this.sessionWriter = sessionWriter;
        this.tokenHasher = tokenHasher;
        this.tokenHashComparer = tokenHashComparer;
        this.logger = logger;
    }

    /**
     * Executes the token refresh process, verifying the incoming refresh token and generating new ones.
     *
     * @param {{ refreshToken: string }} data
     * @returns {Promise<{ accessToken: string, refreshToken: string }>}
     */
    async execute(data) {
        let sessionLockIdentifier;
        let refreshTokenHash;

        try {
            const {
                sub: userId,
                sessionId,
                email,
            } = await this.tokenVerifier.verifyRefreshToken(data.refreshToken);

            const refreshToken = await this.sessionReader.getSession(
                userId,
                sessionId
            );

            if (!refreshToken) {
                throw new UnauthorizedError(SESSION_EXPIRED_INVALID);
            }

            refreshTokenHash = this.tokenHasher.hash(data.refreshToken);
            const cachedSession =
                await this.sessionReader.getCachedSession(refreshTokenHash);

            if (cachedSession) {
                return {
                    accessToken: cachedSession.accessToken,
                    refreshToken: cachedSession.refreshToken,
                };
            }

            const isTokenMatched = this.tokenHashComparer.compare(
                data.refreshToken,
                refreshToken
            );

            if (!isTokenMatched) {
                this.logger.warn('CRITICAL: Session compromised', {
                    authUserId: userId,
                    sessionId: sessionId,
                });
                await this.sessionWriter.clearSession(userId, sessionId);
                throw new UnauthorizedError(SESSION_EXPIRED_INVALID);
            }

            const user = await this.authUserReader.findById(userId);

            if (!user) {
                await this.sessionWriter.clearSession(userId, sessionId);
                throw new UnauthorizedError(USER_UNAVAILABLE);
            }

            sessionLockIdentifier = randomUUID();

            const locked = await this.sessionWriter.lockSessionRefresh(
                refreshTokenHash,
                sessionLockIdentifier
            );

            if (!locked) {
                const cachedSessionResult = await waitedResponse({
                    waitingTime: GET_CACHED_SESSION_WAITING_TIME,
                    pollInterval: GET_CACHED_SESSION_POLLING_INTERVAL,
                    resultCallback: async () =>
                        await this.sessionReader.getCachedSession(
                            refreshTokenHash
                        ),
                });

                if (cachedSessionResult) {
                    return {
                        accessToken: cachedSessionResult.accessToken,
                        refreshToken: cachedSessionResult.refreshToken,
                    };
                } else {
                    throw new TimedOutError(TOKEN_REFRESH_TIMEOUT);
                }
            }

            const {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            } = await this.tokenGenerator.generateTokens({
                userId,
                email: user.email,
                sessionId,
            });

            await this.sessionWriter.cacheSession(
                refreshTokenHash,
                newAccessToken,
                newRefreshToken
            );

            const hashedNewRefreshToken =
                this.tokenHasher.hash(newRefreshToken);

            await this.sessionWriter.initiateSession(
                userId,
                sessionId,
                hashedNewRefreshToken
            );

            this.logger.info(
                'New session generated (access-token + refresh-token)',
                {
                    authUserId: userId,
                    email: maskEmail(email),
                }
            );

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error) {
            if (error instanceof TokenVerificationError) {
                const message = error.isExpired ? TOKEN_EXPIRED : INVALID_TOKEN;
                throw new UnauthorizedError(message);
            }

            throw error;
        } finally {
            if (sessionLockIdentifier) {
                await this.sessionWriter.unlockSessionRefresh(
                    refreshTokenHash,
                    sessionLockIdentifier
                );
            }
        }
    }
}
