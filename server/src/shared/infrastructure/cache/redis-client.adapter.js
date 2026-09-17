import { CachePort } from '../../ports/cache.port.js';

/**
 * Redis adapter implementing the CachePort for standard caching and distributed locking.
 */
export class RedisClient extends CachePort {
    /**
     * @param {{ client: import('redis').RedisClientType }} deps
     */
    constructor({ client }) {
        super();
        this.client = client;
    }

    /**
     * Retrieves a value from the cache.
     *
     * @param {string} key
     * @returns {Promise<string | null>}
     */
    async get(key) {
        return await this.client.get(key);
    }

    /**
     * Sets a value in the cache with an expiration time.
     *
     * @param {string} key
     * @param {string} value
     * @param {number} ttl
     * @returns {Promise<void>}
     */
    async set(key, value, ttl) {
        await this.client.set(key, value, { EX: ttl });
    }

    /**
     * Deletes a value from the cache.
     *
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        await this.client.del(key);
    }

    /**
     * Acquires a distributed lock using NX (Not eXists).
     *
     * @param {string} key
     * @param {string} value
     * @param {number} ttl
     * @returns {Promise<boolean>}
     */
    async acquireLock(key, value, ttl) {
        return await this.client.set(key, value, { NX: true, EX: ttl });
    }

    /**
     * Releases a distributed lock using a Lua script to ensure atomicity.
     *
     * @param {string} key
     * @param {string} value
     * @returns {Promise<void>}
     */
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
