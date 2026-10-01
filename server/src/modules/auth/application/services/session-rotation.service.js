import { maskEmail } from '../../../../shared/util/index.js';

/**
 * Service responsible for executing session rotation under a distributed lock.
 */
export class SessionRotationService {
    /**
     * @param {{
     *   sessionStore: import('../ports/session-store.port.js').SessionStorePort,
     *   tokenHasher: import('../ports/token-hasher.port.js').TokenHasherPort,
     *   sessionLockService: import('./session-lock.service.js').SessionLockService,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ sessionStore, tokenHasher, sessionLockService, logger }) {
        this.sessionStore = sessionStore;
        this.tokenHasher = tokenHasher;
        this.sessionLockService = sessionLockService;
        this.logger = logger;
    }

    /**
     * Rotates session within a distributed lock: generates new tokens, caches them, and persists the new session.
     *
     * @param {string} refreshTokenHash
     * @param {string} userId
     * @param {string} sessionId
     * @param {string} email
     * @param {() => Promise<{ accessToken: string, refreshToken: string }>} tokenFactory
     * @returns {Promise<{ accessToken: string, refreshToken: string }>}
     */
    async rotateSessionWithLock(
        refreshTokenHash,
        userId,
        sessionId,
        email,
        tokenFactory
    ) {
        return this.sessionLockService.withLock(refreshTokenHash, async () => {
            const { accessToken, refreshToken } = await tokenFactory();

            await this.sessionLockService.cacheSession(
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

            this.logger?.info(
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
        });
    }
}
