import ms from 'ms';
import { constructCacheKey } from '../../../../shared/util/index.js';
import { SessionWriterPort } from '../../application/ports/session-writer.port.js';
import {
    ACCESS_TOKEN_BLACKLIST_KEY,
    AUTH_CACHED_SESSION_CACHE_KEY,
    AUTH_SESSION_CACHE_KEY,
    SESSION_LOCK_EXPIRATION,
} from '../../domain/auth-user.constant.js';
import { constructCacheLockKey } from '../../../../shared/util/construct-cache-key.util.js';

export class SessionWriterAdapter extends SessionWriterPort {
    constructor({ client, sessionTimeToLive, logger }) {
        super();
        this.client = client;
        this.sessionTimeToLive = Math.floor(ms(sessionTimeToLive) / 1000);
        this.logger = logger;
    }

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

    async clearSession(authUserId, sessionId) {
        const cacheKey = constructCacheKey(
            AUTH_SESSION_CACHE_KEY,
            authUserId,
            sessionId
        );
        await this.client.delete(cacheKey);
    }

    async blacklistLoginSession(jti, ttl) {
        const cacheKey = constructCacheKey(ACCESS_TOKEN_BLACKLIST_KEY, jti);
        await this.client.set(cacheKey, '1', ttl);
    }

    async lockSessionRefresh(refreshToken, identifier) {
        const key = constructCacheLockKey(AUTH_SESSION_CACHE_KEY, refreshToken);
        await this.client.acquireLock(key, identifier, SESSION_LOCK_EXPIRATION);
    }

    async unlockSessionRefresh(refreshToken, identifier) {
        const key = constructCacheLockKey(AUTH_SESSION_CACHE_KEY, refreshToken);
        await this.client.releaseLock(key, identifier);
    }

    async cacheSession(prevRefreshToken, acessToken, refreshToken) {
        const key = constructCacheKey(
            AUTH_CACHED_SESSION_CACHE_KEY,
            prevRefreshToken
        );
        await this.client.set(
            key,
            JSON.stringify({ acessToken, refreshToken }),
            SESSION_LOCK_EXPIRATION
        );
    }
}
