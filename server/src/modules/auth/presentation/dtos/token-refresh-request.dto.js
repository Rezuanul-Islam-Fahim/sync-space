export class TokenRefreshRequestDto {
    constructor({ token }) {
        this.token = token;
    }

    static from(data) {
        return new TokenRefreshRequestDto(data);
    }
}
