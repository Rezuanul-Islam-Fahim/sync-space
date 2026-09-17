/**
 * Constructs a standardized cache key by joining parts with a colon.
 *
 * @param {string} mainKey
 * @param {string} secondaryKey
 * @param {...string} keys
 * @returns {string}
 */
export const constructCacheKey = (mainKey, secondaryKey, ...keys) => {
    let key = `${mainKey}:${secondaryKey}`;

    keys.forEach(v => {
        key = key.concat(':', v);
    });

    return key;
};

/**
 * Constructs a standardized distributed lock key.
 *
 * @param {string} mainKey
 * @param {string} secondaryKey
 * @returns {string}
 */
export const constructCacheLockKey = (mainKey, secondaryKey) => {
    return `lock:${mainKey}:${secondaryKey}`;
};
