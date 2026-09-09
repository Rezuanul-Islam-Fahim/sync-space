import ms from 'ms';
import { constructCacheKey } from '../../../../shared/util/index.js';
import { SessionWriterPort } from '../../application/ports/session-writer.port.js';
import {
    ACCESS_TOKEN_BLACKLIST_KEY,
    AUTH_SESSION_CACHE_KEY,
} from '../../domain/auth-user.constant.js';

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
}
