/**
 * Port for blacklisting revoked access tokens (ISP segregated).
 */
export class TokenBlacklistPort {
    /**
     * Blacklists an access token by its JWT ID until its natural expiration.
     *
     * @param {string} _jti - JWT ID
     * @param {number} _ttl - Time to live in seconds
     * @returns {Promise<void>}
     */
    blacklistToken(_jti, _ttl) {
        throw new Error('Method not implemented');
    }

    /**
     * Checks if an access token is blacklisted by its JWT ID.
     *
     * @param {string} _jti - JWT ID
     * @returns {Promise<boolean>}
     */
    isTokenBlacklisted(_jti) {
        throw new Error('Method not implemented');
    }
}
