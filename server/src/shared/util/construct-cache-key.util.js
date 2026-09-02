export const constructCacheKey = (mainKey, secondaryKey, ...keys) => {
    let key = `${mainKey}:${secondaryKey}`;

    keys.forEach(v => {
        key = key.concat(':', v);
    });

    return key;
};
