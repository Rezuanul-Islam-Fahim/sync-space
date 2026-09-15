export class TokenRefreshRequestDto {
    constructor({ refreshToken }) {
        this.refreshToken = refreshToken;
    }

    static from(data) {
        return new TokenRefreshRequestDto(data);
    }
}
