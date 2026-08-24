/**
 * Port defining the contract for generating authentication and refresh tokens (ISP segregated).
 */
export class TokenGeneratorPort {
    /**
     * @param {string} _userId
     * @param {string} _email
     * @returns {Promise<{ token: string, refreshToken: string }>}
     */
    generateTokens(_userId, _email) {
        throw new Error('Method not implemented');
    }
}
