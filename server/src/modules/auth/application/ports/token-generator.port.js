/**
 * Port defining the contract for generating authentication and refresh tokens (ISP segregated).
 */
export class TokenGeneratorPort {
    /**
     * @returns {Promise<{ accessToken: string, refreshToken: string }>}
     */
    generateTokens(_params) {
        throw new Error('Method not implemented');
    }
}
