/**
 * Port for distributed locking and transient response caching during token refresh (ISP segregated).
 */
export class SessionRefreshLockPort {
    /**
     * Acquires a distributed lock for refreshing a token session.
     *
     * @param {string} _refreshTokenHash
     * @param {string} _identifier - Unique lock owner identifier
     * @returns {Promise<boolean>}
     */
    acquireLock(_refreshTokenHash, _identifier) {
        throw new Error('Method not implemented');
    }

    /**
     * Releases a distributed lock for a token session.
     *
     * @param {string} _refreshTokenHash
     * @param {string} _identifier - Unique lock owner identifier
     * @returns {Promise<void>}
     */
    releaseLock(_refreshTokenHash, _identifier) {
        throw new Error('Method not implemented');
    }

    /**
     * Retrieves a temporarily cached session generated during concurrent token refresh.
     *
     * @param {string} _refreshTokenHash
     * @returns {Promise<{ accessToken: string, refreshToken: string } | null>}
     */
    getCachedSession(_refreshTokenHash) {
        throw new Error('Method not implemented');
    }

    /**
     * Temporarily caches the newly generated session to serve concurrent refresh requests.
     *
     * @param {string} _refreshTokenHash
     * @param {string} _accessToken
     * @param {string} _refreshToken
     * @returns {Promise<void>}
     */
    cacheSession(_refreshTokenHash, _accessToken, _refreshToken) {
        throw new Error('Method not implemented');
    }
}
