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

export class TokenRefreshUseCase {
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

            refreshTokenHash = this.tokenHasher.hash(data.refreshToken);
            sessionLockIdentifier = randomUUID();

            const locked = await this.sessionWriter.lockSessionRefresh(
                refreshTokenHash,
                sessionLockIdentifier
            );

            if (!locked) {
                const result = await waitedResponse({
                    waitingTime: GET_CACHED_SESSION_WAITING_TIME,
                    pollInterval: GET_CACHED_SESSION_POLLING_INTERVAL,
                    resultCallback: async () =>
                        await this.sessionReader.getCachedSession(
                            refreshTokenHash
                        ),
                });

                if (result) {
                    const resultObj = JSON.parse(result);

                    return {
                        accessToken: resultObj.accessToken,
                        refreshToken: resultObj.refreshToken,
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

            const hashedRefreshToken = this.tokenHasher.hash(newRefreshToken);

            await this.sessionWriter.initiateSession(
                userId,
                sessionId,
                hashedRefreshToken
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
