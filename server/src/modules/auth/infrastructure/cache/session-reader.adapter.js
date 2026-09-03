import { constructCacheKey } from '../../../../shared/util/index.js';
import { SessionReaderPort } from '../../application/ports/session-reader.port.js';
import { authSessionCacheKey } from '../../domain/auth-user.constant.js';

export class SessionReaderAdapter extends SessionReaderPort {
    constructor({ client, logger }) {
        super();
        this.client = client;
        this.logger = logger;
    }

    async getRefreshToken(authUserId, sessionId) {
        const cacheKey = constructCacheKey(
            authSessionCacheKey,
            authUserId,
            sessionId
        );

        return await this.client.get(cacheKey);
    }
}
