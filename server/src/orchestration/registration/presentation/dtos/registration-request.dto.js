export class RegistrationRequestDto {
    constructor(data) {
        this.email = data.email;
        this.username = data.username;
        this.displayName = data.displayName;
        this.dateOfBirth = data.dateOfBirth;
        this.password = data.password;

        Object.freeze(this);
    }

    static from(body) {
        return new RegistrationRequestDto(body);
    }
}
