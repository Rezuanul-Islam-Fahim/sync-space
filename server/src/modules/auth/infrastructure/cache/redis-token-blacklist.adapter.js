import { constructCacheKey } from '../../../../shared/util/index.js';
import { TokenBlacklistPort } from '../../application/ports/token-blacklist.port.js';
import { ACCESS_TOKEN_BLACKLIST_KEY } from '../../domain/auth-user.constant.js';

/**
 * Adapter implementing TokenBlacklistPort using Redis.
 */
export class RedisTokenBlacklistAdapter extends TokenBlacklistPort {
    /**
     * @param {{
     *   client: import('../../../../shared/ports/cache.port.js').CachePort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ client, logger }) {
        super();
        this.client = client;
        this.logger = logger;
    }

    /**
     * Blacklists an access token by its JWT ID.
     *
     * @param {string} jti
     * @param {number} ttl
     * @returns {Promise<void>}
     */
    async blacklistToken(jti, ttl) {
        const cacheKey = constructCacheKey(ACCESS_TOKEN_BLACKLIST_KEY, jti);
        await this.client.set(cacheKey, '1', ttl);
    }

    /**
     * Checks if an access token is blacklisted by its JWT ID.
     *
     * @param {string} jti
     * @returns {Promise<boolean>}
     */
    async isTokenBlacklisted(jti) {
        const cacheKey = constructCacheKey(ACCESS_TOKEN_BLACKLIST_KEY, jti);
        const result = await this.client.get(cacheKey);
        return Boolean(result);
    }
}
