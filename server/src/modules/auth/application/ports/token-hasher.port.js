/**
 * Port for hashing tokens for secure storage.
 */
export class TokenHasherPort {
    /**
     * Hashes the given token.
     *
     * @param {string} _token
     * @returns {string}
     */
    hash(_token) {
        throw new Error('Method not implemented');
    }
}

/**
 * Port for securely comparing a raw token against a hashed token.
 */
export class TokenHashComparerPort {
    /**
     * Compares an incoming token with a stored hash.
     *
     * @param {string} _incomingToken
     * @param {string} _storedHashedHex
     * @returns {boolean}
     */
    compare(_incomingToken, _storedHashedHex) {
        throw new Error('Method not implemented');
    }
}
