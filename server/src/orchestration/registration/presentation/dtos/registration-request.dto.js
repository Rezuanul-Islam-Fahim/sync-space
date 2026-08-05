export class RegistrationRequestDto {
    constructor(data) {
        this.email = data.email;
        this.username = data.username;
        this.displayName = data.displayName;
        this.dateOfBirth = data.dateOfBirth;

        // Hide `password` from enumeration (JSON.stringify, Object.keys, console/logger iteration)
        Object.defineProperty(this, 'password', {
            value: data.password,
            enumerable: false,
            writable: false,
            configurable: false,
        });

        Object.freeze(this);
    }

    static from(body) {
        return new RegistrationRequestDto(body);
    }
}
