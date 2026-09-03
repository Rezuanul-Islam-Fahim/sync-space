/**
 * Port defining the contract for generating authentication and refresh tokens (ISP segregated).
 */
export class TokenGeneratorPort {
    /**
     * @returns {Promise<{ token: string, refreshToken: string }>}
     */
    generateTokens({ _userId, _email, _sessionId }) {
        throw new Error('Method not implemented');
    }
}
