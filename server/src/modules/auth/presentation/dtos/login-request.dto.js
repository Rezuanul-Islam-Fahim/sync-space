export class LoginRequestDto {
    constructor(data) {
        this.email = data.email;

        // Hide `password` from enumeration (JSON.stringify, Object.keys, console/logger iteration)
        Object.defineProperty(this, 'password', {
            value: data.password,
            enumerable: false,
            writable: false,
            configurable: false,
        });

        Object.freeze(this);
    }

    static from(data) {
        return new LoginRequestDto(data);
    }
}
