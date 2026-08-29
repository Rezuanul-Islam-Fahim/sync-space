import { CachePort } from '../../ports/cache.port.js';

export class RedisClient extends CachePort {
    constructor({ client, logger }) {
        super();
        this.client = client;
        this.logger = logger;
    }

    async get(key) {
        return await this.client.get(key);
    }

    async set(key, value, ttl) {
        return await this.client.set(key, value, { EX: ttl });
    }

    async del(key) {
        return await this.client.del(key);
    }
}
