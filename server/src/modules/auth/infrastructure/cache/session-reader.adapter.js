import { constructCacheKey } from '../../../../shared/util/index.js';
import { SessionReaderPort } from '../../application/ports/session-reader.port.js';
import {
    ACCESS_TOKEN_BLACKLIST_KEY,
    AUTH_SESSION_CACHE_KEY,
} from '../../domain/auth-user.constant.js';

export class SessionReaderAdapter extends SessionReaderPort {
    constructor({ client, logger }) {
        super();
        this.client = client;
        this.logger = logger;
    }

    async getSession(authUserId, sessionId) {
        const cacheKey = constructCacheKey(
            AUTH_SESSION_CACHE_KEY,
            authUserId,
            sessionId
        );

        return await this.client.get(cacheKey);
    }

    async getBlacklistedLoginSession(jti) {
        const cacheKey = constructCacheKey(ACCESS_TOKEN_BLACKLIST_KEY, jti);
        return await this.client.get(cacheKey);
    }
}
