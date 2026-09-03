export class LogoutRequestDto {
    constructor({ refreshToken }) {
        this.refreshToken = refreshToken;
    }

    static from(data) {
        return new LogoutRequestDto(data);
    }
}
