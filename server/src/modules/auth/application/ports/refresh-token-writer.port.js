export class RefreshTokenWriterPort {
    store(_sessionId, _authUserId, _token) {
        throw new Error('Method not implemented');
    }

    delete(_sessionId, _authUserId) {
        throw new Error('Method not implemented');
    }
}
