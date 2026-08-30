import { constructCacheKey } from '../../../../shared/util/index.js';
import { RefreshTokenWriterPort } from '../../application/ports/refresh-token-writer.port.js';
import {
    authSessionCacheKey,
    authSessionTimeToLive,
} from '../../domain/auth-user.constant.js';

export class RefreshTokenWriterAdapter extends RefreshTokenWriterPort {
    constructor({ client, logger }) {
        super();
        this.client = client;
        this.logger = logger;
    }

    async store(sessionId, authUserId, refreshToken) {
        const cacheKey = constructCacheKey(
            authSessionCacheKey,
            authUserId,
            sessionId
        );
        await this.client.set(cacheKey, refreshToken, authSessionTimeToLive);
    }

    async delete(sessionId, authUserId) {
        const cacheKey = constructCacheKey(
            authSessionCacheKey,
            authUserId,
            sessionId
        );
        await this.client.delete(cacheKey);
    }
}
