import { constructCacheKey } from '../../../../shared/util/index.js';
import { SessionWriterPort } from '../../application/ports/session-writer.port.js';
import {
    authSessionCacheKey,
    authSessionTimeToLive,
} from '../../domain/auth-user.constant.js';

export class SessionWriterAdapter extends SessionWriterPort {
    constructor({ client, logger }) {
        super();
        this.client = client;
        this.logger = logger;
    }

    async storeRefreshToken(sessionId, authUserId, refreshToken) {
        const cacheKey = constructCacheKey(
            authSessionCacheKey,
            authUserId,
            sessionId
        );
        await this.client.set(cacheKey, refreshToken, authSessionTimeToLive);
    }

    async deleteRefreshToken(sessionId, authUserId) {
        const cacheKey = constructCacheKey(
            authSessionCacheKey,
            authUserId,
            sessionId
        );
        await this.client.delete(cacheKey);
    }
}
