import {
    constructCacheKey,
    constructCacheLockKey,
} from '../../../../shared/util/index.js';
import { SessionRefreshLockPort } from '../../application/ports/session-refresh-lock.port.js';
import {
    AUTH_CACHED_SESSION_CACHE_KEY,
    AUTH_SESSION_CACHE_KEY,
    CACHED_SESSION_EXPIRATION,
    SESSION_LOCK_EXPIRATION,
} from '../../domain/auth-user.constant.js';

/**
 * Adapter implementing SessionRefreshLockPort using Redis.
 */
export class RedisSessionRefreshLockAdapter extends SessionRefreshLockPort {
    /**
     * @param {{
     *   client: import('../../../../shared/ports/cache.port.js').CachePort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ client, logger }) {
        super();
        this.client = client;
        this.logger = logger;
    }

    /**
     * Acquires a distributed lock for refreshing a token session.
     *
     * @param {string} refreshTokenHash
     * @param {string} identifier
     * @returns {Promise<boolean>}
     */
    async acquireLock(refreshTokenHash, identifier) {
        const key = constructCacheLockKey(
            AUTH_SESSION_CACHE_KEY,
            refreshTokenHash
        );
        const acquired = await this.client.acquireLock(
            key,
            identifier,
            SESSION_LOCK_EXPIRATION
        );
        return Boolean(acquired);
    }

    /**
     * Releases the distributed lock.
     *
     * @param {string} refreshTokenHash
     * @param {string} identifier
     * @returns {Promise<void>}
     */
    async releaseLock(refreshTokenHash, identifier) {
        const key = constructCacheLockKey(
            AUTH_SESSION_CACHE_KEY,
            refreshTokenHash
        );
        await this.client.releaseLock(key, identifier);
    }

    /**
     * Retrieves a temporarily cached session generated during concurrent token refresh.
     *
     * @param {string} refreshTokenHash
     * @returns {Promise<{ accessToken: string, refreshToken: string } | null>}
     */
    async getCachedSession(refreshTokenHash) {
        const key = constructCacheKey(
            AUTH_CACHED_SESSION_CACHE_KEY,
            refreshTokenHash
        );
        const result = await this.client.get(key);

        if (!result) return null;

        return JSON.parse(result);
    }

    /**
     * Temporarily caches the newly generated session to serve concurrent refresh requests.
     *
     * @param {string} refreshTokenHash
     * @param {string} accessToken
     * @param {string} refreshToken
     * @returns {Promise<void>}
     */
    async cacheSession(refreshTokenHash, accessToken, refreshToken) {
        const key = constructCacheKey(
            AUTH_CACHED_SESSION_CACHE_KEY,
            refreshTokenHash
        );
        await this.client.set(
            key,
            JSON.stringify({ accessToken, refreshToken }),
            CACHED_SESSION_EXPIRATION
        );
    }
}
