export class TokenRefreshResponseDto {
    constructor({ accessToken, refreshToken }) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    static from(data) {
        return new TokenRefreshResponseDto(data);
    }
}
