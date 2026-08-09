/**
 * Safely converts Mongoose Document instances or plain JS objects into clean plain objects.
 * Handles null/undefined inputs gracefully and executes `.toObject()` when passed Mongoose documents.
 *
 * @param {any} value
 * @param {object} [options={ getters: true }]
 * @returns {object | null}
 */
export const toRawObject = (value, options = { getters: true }) => {
    if (value === null || value === undefined) return null;
    if (typeof value !== 'object') return value;

    const raw =
        typeof value.toObject === 'function'
            ? value.toObject(options)
            : { ...value };

    if (raw && typeof raw === 'object' && '__v' in raw) {
        delete raw.__v;
    }

    return raw;
};
