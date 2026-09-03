export class SessionWriterPort {
    /**
     * @param {string} _sessionId
     * @param {string} _authUserId
     * @param {string} _refreshToken
     * @returns {Promise}
     */
    storeRefreshToken(_sessionId, _authUserId, _refreshToken) {
        throw new Error('Method not implemented');
    }

    deleteRefreshToken(_sessionId, _authUserId) {
        throw new Error('Method not implemented');
    }
}
