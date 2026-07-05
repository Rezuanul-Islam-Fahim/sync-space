export class TokenServicePort {
    generateTokens(_userId, _email) {
        throw new Error('Method not implemented');
    }

    verifyAccessToken(_token) {
        throw new Error('Method not implemented');
    }

    verifyRefreshToken(_token) {
        throw new Error('Method not implemented');
    }
}
