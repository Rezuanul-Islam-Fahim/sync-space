import ms from 'ms';
import { constructCacheKey } from '../../../../shared/util/index.js';
import { SessionWriterPort } from '../../application/ports/session-writer.port.js';
import {
    ACCESS_TOKEN_BLACKLIST_KEY,
    AUTH_CACHED_SESSION_CACHE_KEY,
    AUTH_SESSION_CACHE_KEY,
    CACHED_SESSION_EXPIRATION,
    SESSION_LOCK_EXPIRATION,
} from '../../domain/auth-user.constant.js';
import { constructCacheLockKey } from '../../../../shared/util/construct-cache-key.util.js';

/**
 * Adapter implementing SessionWriterPort using Redis.
 */
export class SessionWriterAdapter extends SessionWriterPort {
    /**
     * @param {{ client: import('../../../../shared/ports/cache.port.js').CachePort, sessionTimeToLive: string, logger?: import('../../../../shared/ports/index.js').LoggerPort }} deps
     */
    constructor({ client, sessionTimeToLive, logger }) {
        super();
        this.client = client;
        this.sessionTimeToLive = Math.floor(ms(sessionTimeToLive) / 1000);
        this.logger = logger;
    }

    /**
     * Initiates a new session and stores the hashed refresh token.
     *
     * @param {string} authUserId
     * @param {string} sessionId
     * @param {string} hashedRefreshToken
     * @returns {Promise<void>}
     */
    async initiateSession(authUserId, sessionId, hashedRefreshToken) {
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
     * Clears an active session by removing its refresh token.
     *
     * @param {string} authUserId
     * @param {string} sessionId
     * @returns {Promise<void>}
     */
    async clearSession(authUserId, sessionId) {
        const cacheKey = constructCacheKey(
            AUTH_SESSION_CACHE_KEY,
            authUserId,
            sessionId
        );
        await this.client.delete(cacheKey);
    }

    /**
     * Blacklists an access token to prevent further usage until it expires.
     *
     * @param {string} jti
     * @param {number} ttl
     * @returns {Promise<void>}
     */
    async blacklistLoginSession(jti, ttl) {
        const cacheKey = constructCacheKey(ACCESS_TOKEN_BLACKLIST_KEY, jti);
        await this.client.set(cacheKey, '1', ttl);
    }

    /**
     * Acquires a distributed lock to handle concurrent token refresh requests.
     *
     * @param {string} refreshToken
     * @param {string} identifier
     * @returns {Promise<boolean>}
     */
    async lockSessionRefresh(refreshToken, identifier) {
        const key = constructCacheLockKey(AUTH_SESSION_CACHE_KEY, refreshToken);
        return await this.client.acquireLock(
            key,
            identifier,
            SESSION_LOCK_EXPIRATION
        );
    }

    /**
     * Releases the distributed lock.
     *
     * @param {string} refreshToken
     * @param {string} identifier
     * @returns {Promise<void>}
     */
    async unlockSessionRefresh(refreshToken, identifier) {
        const key = constructCacheLockKey(AUTH_SESSION_CACHE_KEY, refreshToken);
        await this.client.releaseLock(key, identifier);
    }

    /**
     * Temporarily caches the newly generated tokens to serve concurrent refresh requests.
     *
     * @param {string} prevRefreshToken
     * @param {string} accessToken
     * @param {string} refreshToken
     * @returns {Promise<void>}
     */
    async cacheSession(prevRefreshToken, accessToken, refreshToken) {
        const key = constructCacheKey(
            AUTH_CACHED_SESSION_CACHE_KEY,
            prevRefreshToken
        );
        await this.client.set(
            key,
            JSON.stringify({ accessToken, refreshToken }),
            CACHED_SESSION_EXPIRATION
        );
    }
}
