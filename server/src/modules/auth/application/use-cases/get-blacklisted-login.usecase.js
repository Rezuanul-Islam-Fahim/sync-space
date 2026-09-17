/**
 * Use case for retrieving a blacklisted login session by its JWT ID (jti).
 */
export class GetBlacklistedLoginUseCase {
    /**
     * @param {{
     *   sessionReader: import('../ports/session-reader.port.js').SessionReaderPort
     * }} deps
     */
    constructor({ sessionReader }) {
        this.sessionReader = sessionReader;
    }

    /**
     * Executes the retrieval of a blacklisted session.
     *
     * @param {string} jti - The JWT ID to check for blacklisting.
     * @returns {Promise<boolean | object>} The blacklisted session if found, else false/null.
     */
    async execute(jti) {
        return await this.sessionReader.getBlacklistedLoginSession(jti);
    }
}
