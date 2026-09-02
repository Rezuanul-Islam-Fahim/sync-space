export class TokenRefreshResponseDto {
    constructor({ token, refreshToken }) {
        this.token = token;
        this.refreshToken = refreshToken;
    }

    static from(data) {
        return new TokenRefreshResponseDto(data);
    }
}
