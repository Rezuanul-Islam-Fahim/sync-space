import { randomUUID } from 'node:crypto';
import {
    TimedOutError,
    UnauthorizedError,
} from '../../../../shared/error/index.js';
import {
    GET_CACHED_SESSION_POLLING_INTERVAL,
    GET_CACHED_SESSION_WAITING_TIME,
    SESSION_EXPIRED_INVALID,
    TOKEN_REFRESH_TIMEOUT,
} from '../../domain/auth-user.constant.js';
import { maskEmail } from '../../../../shared/util/mask-email.util.js';
import { waitedResponse } from '../../../../shared/util/index.js';

export class SessionRotationService {
    /**
     *
     * @param {{
     *   sessionStore: import('../ports/session-store.port').SessionStorePort
     *   tokenHasher: import('../ports/token-hasher.port').TokenHasherPort
     *   tokenHashComparer: import('../ports/token-hasher.port').TokenHashComparerPort
     *   sessionRefreshLock: import('../ports/session-refresh-lock.port').SessionRefreshLockPort
     *   logger: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({
        sessionStore,
        tokenHasher,
        tokenHashComparer,
        sessionRefreshLock,
        logger,
    }) {
        this.sessionStore = sessionStore;
        this.tokenHasher = tokenHasher;
        this.tokenHashComparer = tokenHashComparer;
        this.sessionRefreshLock = sessionRefreshLock;
        this.logger = logger;
    }

    async validateSession(userId, sessionId, refreshToken) {
        const refreshTokenHash = await this.sessionStore.getSession(
            userId,
            sessionId
        );

        if (!refreshTokenHash) {
            throw new UnauthorizedError(SESSION_EXPIRED_INVALID);
        }

        const incomingRefreshTokenHash = this.tokenHasher.hash(refreshToken);
        const cachedSession =
            await this.sessionRefreshLock.getCachedSession(refreshTokenHash);

        if (cachedSession) {
            return {
                cache: true,
                tokens: {
                    accessToken: cachedSession.accessToken,
                    refreshToken: cachedSession.refreshToken,
                },
            };
        }

        const isTokenMatched = this.tokenHashComparer.compare(
            refreshToken,
            refreshTokenHash
        );

        if (!isTokenMatched) {
            this.logger.warn('CRITICAL: Session compromised', {
                authUserId: userId,
                sessionId: sessionId,
            });
            await this.sessionStore.deleteSession(userId, sessionId);
            throw new UnauthorizedError(SESSION_EXPIRED_INVALID);
        }

        return {
            cache: false,
            refreshTokenHash: incomingRefreshTokenHash,
        };
    }

    async invalidateSession(userId, sessionId) {
        await this.sessionStore.deleteSession(userId, sessionId);
    }

    async rotateSessionWithLock(
        refreshTokenHash,
        userId,
        sessionId,
        email,
        tokenFactory
    ) {
        const lockValue = randomUUID();

        try {
            const locked = await this.sessionRefreshLock.acquireLock(
                refreshTokenHash,
                lockValue
            );

            if (!locked) {
                const cachedSessionResult = await waitedResponse({
                    waitingTime: GET_CACHED_SESSION_WAITING_TIME,
                    pollInterval: GET_CACHED_SESSION_POLLING_INTERVAL,
                    resultCallback: async () =>
                        await this.sessionRefreshLock.getCachedSession(
                            refreshTokenHash
                        ),
                });

                if (!cachedSessionResult) {
                    throw new TimedOutError(TOKEN_REFRESH_TIMEOUT);
                }

                return {
                    accessToken: cachedSessionResult.accessToken,
                    refreshToken: cachedSessionResult.refreshToken,
                };
            }

            const { accessToken, refreshToken } = await tokenFactory();

            await this.sessionRefreshLock.cacheSession(
                refreshTokenHash,
                accessToken,
                refreshToken
            );

            const hashedNewRefreshToken = this.tokenHasher.hash(refreshToken);

            await this.sessionStore.saveSession(
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
                accessToken,
                refreshToken,
            };
        } finally {
            try {
                await this.sessionRefreshLock.releaseLock(
                    refreshTokenHash,
                    lockValue
                );
            } catch (releaseError) {
                this.logger?.warn?.(
                    'Failed to release session refresh lock in finally block',
                    {
                        refreshTokenHash,
                        lockValue,
                        error: releaseError.message,
                    }
                );
            }
        }
    }
}
