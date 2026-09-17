/**
 * Port defining the contract for verifying access and refresh tokens (ISP segregated).
 */
export class TokenVerifierPort {
    /**
     * @param {string} _accessToken
     * @returns {Promise<object>} Decoded token payload containing user identity claims
     * @throws {import('../errors/token-verification.error.js').TokenExpiredError}
     * @throws {import('../errors/token-verification.error.js').TokenInvalidError}
     */
    verifyAccessToken(_accessToken) {
        throw new Error('Method not implemented');
    }

    /**
     * @param {string} _refreshToken
     * @returns {Promise<object>} Decoded token payload containing user identity claims
     * @throws {import('../errors/token-verification.error.js').TokenExpiredError}
     * @throws {import('../errors/token-verification.error.js').TokenInvalidError}
     */
    verifyRefreshToken(_refreshToken) {
        throw new Error('Method not implemented');
    }
}
