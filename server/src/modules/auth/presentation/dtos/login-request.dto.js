export class LoginRequestDto {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
    }

    static from(data) {
        return new LoginRequestDto(data);
    }
}
