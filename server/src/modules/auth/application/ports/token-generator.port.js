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
