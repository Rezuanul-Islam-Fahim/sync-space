import { constructCacheKey } from '../../../../shared/util/index.js';
import { SessionWriterPort } from '../../application/ports/session-writer.port.js';
import {
    ACCESS_TOKEN_BLACKLIST_KEY,
    AUTH_SESSION_CACHE_KEY,
    AUTH_SESSION_TIME_TO_LIVE,
} from '../../domain/auth-user.constant.js';

export class SessionWriterAdapter extends SessionWriterPort {
    constructor({ client, logger }) {
        super();
        this.client = client;
        this.logger = logger;
    }

    async initiateSession(sessionId, authUserId, refreshToken) {
        const cacheKey = constructCacheKey(
            AUTH_SESSION_CACHE_KEY,
            authUserId,
            sessionId
        );
        await this.client.set(
            cacheKey,
            refreshToken,
            AUTH_SESSION_TIME_TO_LIVE
        );
    }

    async clearSession(sessionId, authUserId) {
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
