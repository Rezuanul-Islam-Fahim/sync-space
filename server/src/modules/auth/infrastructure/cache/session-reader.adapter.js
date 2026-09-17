import { constructCacheKey } from '../../../../shared/util/index.js';
import { SessionReaderPort } from '../../application/ports/session-reader.port.js';
import {
    ACCESS_TOKEN_BLACKLIST_KEY,
    AUTH_CACHED_SESSION_CACHE_KEY,
    AUTH_SESSION_CACHE_KEY,
} from '../../domain/auth-user.constant.js';

/**
 * Adapter implementing SessionReaderPort using Redis.
 */
export class SessionReaderAdapter extends SessionReaderPort {
    /**
     * @param {{ client: import('../../../../shared/ports/cache.port.js').CachePort, logger?: import('../../../../shared/ports/index.js').LoggerPort }} deps
     */
    constructor({ client, logger }) {
        super();
        this.client = client;
        this.logger = logger;
    }

    /**
     * Retrieves the stored refresh token for a given session.
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
     * Retrieves the blacklisted login session by JWT ID.
     *
     * @param {string} jti
     * @returns {Promise<string | null>}
     */
    async getBlacklistedLoginSession(jti) {
        const cacheKey = constructCacheKey(ACCESS_TOKEN_BLACKLIST_KEY, jti);
        return await this.client.get(cacheKey);
    }

    /**
     * Retrieves a temporarily cached new session generated during a concurrent refresh.
     *
     * @param {string} refreshToken
     * @returns {Promise<{ accessToken: string, refreshToken: string } | undefined>}
     */
    async getCachedSession(refreshToken) {
        const cacheKey = constructCacheKey(
            AUTH_CACHED_SESSION_CACHE_KEY,
            refreshToken
        );
        const result = await this.client.get(cacheKey);

        if (!result) return undefined;

        const resultObj = JSON.parse(result);
        return resultObj;
    }
}
