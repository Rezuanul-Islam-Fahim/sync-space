/**
 * Converts Mongoose document objects to plain JavaScript objects if applicable.
 *
 * @param {object} value
 * @returns {object | null}
 */
export const toRawObject = value => {
    if (!value) return null;

    return typeof value.toObject === 'function' ? value.toObject() : value;
};
