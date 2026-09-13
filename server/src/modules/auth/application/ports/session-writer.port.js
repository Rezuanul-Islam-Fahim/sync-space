export class SessionWriterPort {
    /**
     * @param {string} _sessionId
     * @param {string} _authUserId
     * @param {string} _refreshToken
     * @returns {Promise}
     */
    initiateSession(_authUserId, _sessionId, _refreshToken) {
        throw new Error('Method not implemented');
    }

    clearSession(_authUserId, _sessionId) {
        throw new Error('Method not implemented');
    }

    blacklistLoginSession(_jti, _ttl) {
        throw new Error('Method not implemented');
    }

    lockSessionRefresh(_refreshToken, _identifier) {
        throw new Error('Method not implemented');
    }

    unlockSessionRefresh(_refreshToken, _identifier) {
        throw new Error('Method not implemented');
    }

    cacheSession(_userId, _accessToken, _refreshToken) {
        throw new Error('Method not implemented');
    }
}
