export class LogoutRequestDto {
    constructor({ token }) {
        this.token = token;
    }

    static from(data) {
        return new LogoutRequestDto(data);
    }
}
