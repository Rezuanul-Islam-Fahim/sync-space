export class TokenRefreshUseCase {
    constructor({ tokenVerifier, refreshTokenReader, refreshTokenWriter }) {
        this.tokenVerifier = tokenVerifier;
        this.refreshTokenReader = refreshTokenReader;
        this.refreshTokenWriter = refreshTokenWriter;
    }
}
