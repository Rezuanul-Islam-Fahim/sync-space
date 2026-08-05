export class LoginRequestDto {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;

        Object.freeze(this);
    }

    static from(data) {
        return new LoginRequestDto(data);
    }
}
