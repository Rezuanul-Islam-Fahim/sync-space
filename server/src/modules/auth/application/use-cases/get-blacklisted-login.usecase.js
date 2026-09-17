/**
 * Use case for retrieving a blacklisted login session by its JWT ID (jti).
 */
export class GetBlacklistedLoginUseCase {
    /**
     * @param {{
     *   tokenBlacklist: import('../ports/token-blacklist.port.js').TokenBlacklistPort
     * }} deps
     */
    constructor({ tokenBlacklist }) {
        this.tokenBlacklist = tokenBlacklist;
    }

    /**
     * Executes the check for whether a token session is blacklisted.
     *
     * @param {string} jti - The JWT ID to check for blacklisting.
     * @returns {Promise<boolean>} True if blacklisted, false otherwise.
     */
    async execute(jti) {
        return await this.tokenBlacklist.isTokenBlacklisted(jti);
    }
}
