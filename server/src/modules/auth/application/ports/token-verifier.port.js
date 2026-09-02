/**
 * Port defining the contract for verifying access and refresh tokens (ISP segregated).
 */
export class TokenVerifierPort {
    /**
     * @param {string} _token
     * @returns {Promise<object>} Decoded token payload containing user identity claims
     */
    verifyAccessToken(_token) {
        throw new Error('Method not implemented');
    }

    /**
     * @param {string} _token
     * @returns {Promise<object>} Decoded token payload containing user identity claims
     */
    verifyRefreshToken(_token) {
        throw new Error('Method not implemented');
    }
}
