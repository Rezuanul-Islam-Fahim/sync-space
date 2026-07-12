export class RegisterRequestDto {
    constructor(data) {
        this.email = data.email;
        this.username = data.username;
        this.password = data.password;
        this.displayName = data.displayName;
        this.dateOfBirth = data.dateOfBirth;
    }

    static from(body) {
        return new RegisterRequestDto(body);
    }
}
