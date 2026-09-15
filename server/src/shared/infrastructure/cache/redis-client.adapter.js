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

    async acquireLock(key, value, ttl) {
        return await this.client.set(key, value, { NX: true, EX: ttl });
    }

    async releaseLock(key, value) {
        const script = `
            if redis.call("GET", KEYS[1]) == ARGV[1] then
                return redis.call("DEL", KEYS[1])
            else
                return 0
            end
        `;

        await this.client.eval(script, {
            keys: [key],
            arguments: [value],
        });
    }
}
