export class RefreshTokenWriterPort {
    /**
     * @param {string} deviceId
     * @param {string} authUserId
     * @param {string} refreshToken
     * @returns {Promise}
     */
    store({ _deviceId, _authUserId, _refreshToken }) {
        throw new Error('Method not implemented');
    }

    delete(_sessionId, _authUserId) {
        throw new Error('Method not implemented');
    }
}
