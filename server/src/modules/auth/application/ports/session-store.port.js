/**
 * Port for managing active refresh token sessions (ISP segregated).
 */
export class SessionStorePort {
    /**
     * Retrieves the stored hashed refresh token for a given user and session.
     *
     * @param {string} _authUserId
     * @param {string} _sessionId
     * @returns {Promise<string | null>}
     */
    getSession(_authUserId, _sessionId) {
        throw new Error('Method not implemented');
    }

    /**
     * Persists an active session with its hashed refresh token.
     *
     * @param {string} _authUserId
     * @param {string} _sessionId
     * @param {string} _hashedRefreshToken
     * @returns {Promise<void>}
     */
    saveSession(_authUserId, _sessionId, _hashedRefreshToken) {
        throw new Error('Method not implemented');
    }

    /**
     * Deletes an active session.
     *
     * @param {string} _authUserId
     * @param {string} _sessionId
     * @returns {Promise<void>}
     */
    deleteSession(_authUserId, _sessionId) {
        throw new Error('Method not implemented');
    }
}
