export class RefreshTokenWriterPort {
    /**
     * @param {string} _sessionId
     * @param {string} _authUserId
     * @param {string} _refreshToken
     * @returns {Promise}
     */
    store(_sessionId, _authUserId, _refreshToken) {
        throw new Error('Method not implemented');
    }

    delete(_sessionId, _authUserId) {
        throw new Error('Method not implemented');
    }
}
