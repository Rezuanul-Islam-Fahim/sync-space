import { UnauthorizedError } from '../../../../shared/error/index.js';
import { SESSION_EXPIRED_INVALID } from '../../domain/auth-user.constant.js';

export class SessionRotationService {
    /**
     *
     * @param {{
     *   tokenGenerator: import('../ports/token-generator.port').TokenGeneratorPort
     *   sessionStore: import('../ports/session-store.port').SessionStorePort
     *   tokenHasher: import('../ports/token-hasher.port').TokenHasherPort
     *   tokenHashComparer: import('../ports/token-hasher.port').TokenHashComparerPort
     *   sessionRefreshLock: import('../ports/session-refresh-lock.port').SessionRefreshLockPort
     *   logger: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({
        tokenGenerator,
        sessionStore,
        tokenHasher,
        tokenHashComparer,
        sessionRefreshLock,
        logger,
    }) {
        this.tokenGenerator = tokenGenerator;
        this.sessionStore = sessionStore;
        this.tokenHasher = tokenHasher;
        this.sessionRefreshLock = sessionRefreshLock;
        this.tokenHashComparer = tokenHashComparer;
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
}
