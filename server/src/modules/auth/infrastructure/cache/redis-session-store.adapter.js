import ms from 'ms';
import { constructCacheKey } from '../../../../shared/util/index.js';
import { SessionStorePort } from '../../application/ports/session-store.port.js';
import { AUTH_SESSION_CACHE_KEY } from '../../domain/auth-user.constant.js';

/**
 * Adapter implementing SessionStorePort using Redis.
 */
export class RedisSessionStoreAdapter extends SessionStorePort {
    /**
     * @param {{
     *   client: import('../../../../shared/ports/cache.port.js').CachePort,
     *   sessionTimeToLive: string,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ client, sessionTimeToLive, logger }) {
        super();
        this.client = client;
        this.sessionTimeToLive = Math.floor(ms(sessionTimeToLive) / 1000);
        this.logger = logger;
    }

    /**
     * Retrieves the stored refresh token for a given user and session.
     *
     * @param {string} authUserId
     * @param {string} sessionId
     * @returns {Promise<string | null>}
     */
    async getSession(authUserId, sessionId) {
        const cacheKey = constructCacheKey(
            AUTH_SESSION_CACHE_KEY,
            authUserId,
            sessionId
        );

        return await this.client.get(cacheKey);
    }

    /**
     * Persists an active session with its hashed refresh token.
     *
     * @param {string} authUserId
     * @param {string} sessionId
     * @param {string} hashedRefreshToken
     * @returns {Promise<void>}
     */
    async saveSession(authUserId, sessionId, hashedRefreshToken) {
        const cacheKey = constructCacheKey(
            AUTH_SESSION_CACHE_KEY,
            authUserId,
            sessionId
        );

        await this.client.set(
            cacheKey,
            hashedRefreshToken,
            this.sessionTimeToLive
        );
    }

    /**
     * Deletes an active session.
     *
     * @param {string} authUserId
     * @param {string} sessionId
     * @returns {Promise<void>}
     */
    async deleteSession(authUserId, sessionId) {
        const cacheKey = constructCacheKey(
            AUTH_SESSION_CACHE_KEY,
            authUserId,
            sessionId
        );

        await this.client.delete(cacheKey);
    }
}
