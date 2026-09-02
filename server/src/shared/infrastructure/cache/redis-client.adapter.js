import { CachePort } from '../../ports/cache.port.js';

export class RedisClient extends CachePort {
    constructor({ client }) {
        super();
        this.client = client;
    }

    async get(key) {
        return await this.client.get(key);
    }

    async set(key, value, ttl) {
        await this.client.set(key, value, { EX: ttl });
    }

    async delete(key) {
        await this.client.del(key);
    }
}
