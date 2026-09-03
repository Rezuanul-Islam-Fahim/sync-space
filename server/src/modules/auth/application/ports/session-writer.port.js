export class SessionWriterPort {
    /**
     * @param {string} _sessionId
     * @param {string} _authUserId
     * @param {string} _refreshToken
     * @returns {Promise}
     */
    initiateSession(_sessionId, _authUserId, _refreshToken) {
        throw new Error('Method not implemented');
    }

    clearSession(_sessionId, _authUserId) {
        throw new Error('Method not implemented');
    }

    blacklistLoginSession(_jti, _ttl) {
        throw new Error('Method not implemented');
    }
}
