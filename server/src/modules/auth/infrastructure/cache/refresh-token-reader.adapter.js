import { constructCacheKey } from '../../../../shared/util/index.js';
import { RefreshTokenReaderPort } from '../../application/ports/refresh-token-reader.port.js';
import { authSessionCacheKey } from '../../domain/auth-user.constant.js';

export class RefreshTokenReaderAdapter extends RefreshTokenReaderPort {
    constructor({ client, logger }) {
        super();
        this.client = client;
        this.logger = logger;
    }

    async get(authUserId, sessionId) {
        const cacheKey = constructCacheKey(
            authSessionCacheKey,
            authUserId,
            sessionId
        );

        return await this.client.get(cacheKey);
    }
}
