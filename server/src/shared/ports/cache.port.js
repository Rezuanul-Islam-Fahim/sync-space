/**
 * Abstract port defining cache client operations.
 */
export class CachePort {
    /**
     * Retrieves a value from the cache.
     *
     * @param {string} _key
     * @returns {Promise<string | null>}
     */
    get(_key) {
        throw new Error('Method not implemented');
    }

    /**
     * Stores a value in the cache with an optional time-to-live.
     *
     * @param {string} _key
     * @param {string} _value
     * @param {number} [_ttl] - Time to live in seconds.
     * @returns {Promise<void>}
     */
    set(_key, _value, _ttl) {
        throw new Error('Method not implemented');
    }

    /**
     * Deletes a value from the cache.
     *
     * @param {string} _key
     * @returns {Promise<void>}
     */
    delete(_key) {
        throw new Error('Method not implemented');
    }

    /**
     * Acquires a distributed lock.
     *
     * @param {string} _key
     * @param {string} _value - Unique identifier for the lock owner.
     * @param {number} _ttl - Lock expiration in milliseconds.
     * @returns {Promise<boolean>} True if lock acquired, false otherwise.
     */
    acquireLock(_key, _value, _ttl) {
        throw new Error('Method not implemented');
    }

    /**
     * Releases a distributed lock.
     *
     * @param {string} _key
     * @param {string} _value - Unique identifier for the lock owner.
     * @returns {Promise<void>}
     */
    releaseLock(_key, _value) {
        throw new Error('Method not implemented');
    }
}
