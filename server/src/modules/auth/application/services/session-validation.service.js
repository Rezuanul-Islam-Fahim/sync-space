import { UnauthorizedError } from '../../../../shared/error/index.js';
import { SESSION_EXPIRED_INVALID } from '../../domain/auth-user.constant.js';

/**
 * Service responsible for validating sessions and detecting compromised session tokens.
 */
export class SessionValidationService {
    /**
     * @param {{
     *   sessionStore: import('../ports/session-store.port.js').SessionStorePort,
     *   tokenHasher: import('../ports/token-hasher.port.js').TokenHasherPort,
     *   tokenHashComparer: import('../ports/token-hasher.port.js').TokenHashComparerPort,
     *   sessionLockService: import('./session-lock.service.js').SessionLockService,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({
        sessionStore,
        tokenHasher,
        tokenHashComparer,
        sessionLockService,
        logger,
    }) {
        this.sessionStore = sessionStore;
        this.tokenHasher = tokenHasher;
        this.tokenHashComparer = tokenHashComparer;
        this.sessionLockService = sessionLockService;
        this.logger = logger;
    }

    /**
     * Validates an incoming refresh token against the stored session and cached rotations.
     *
     * @param {string} userId
     * @param {string} sessionId
     * @param {string} refreshToken
     * @returns {Promise<{ cache: true, tokens: { accessToken: string, refreshToken: string } } | { cache: false, refreshTokenHash: string }>}
     */
    async validateSession(userId, sessionId, refreshToken) {
        const refreshTokenHash = await this.sessionStore.getSession(
            userId,
            sessionId
        );

        if (!refreshTokenHash) {
            throw new UnauthorizedError(SESSION_EXPIRED_INVALID);
        }

        const incomingRefreshTokenHash = this.tokenHasher.hash(refreshToken);
        const cachedSession = await this.sessionLockService.getCachedSession(
            incomingRefreshTokenHash
        );

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
            this.logger?.warn('CRITICAL: Session compromised', {
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

    /**
     * Invalidates a session in the store.
     *
     * @param {string} userId
     * @param {string} sessionId
     * @returns {Promise<void>}
     */
    async invalidateSession(userId, sessionId) {
        await this.sessionStore.deleteSession(userId, sessionId);
    }
}
