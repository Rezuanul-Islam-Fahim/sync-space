/**
 * Presentation DTO for parsing login request body payload.
 */
export class LoginRequestDto {
    /**
     * @param {{ email: string, password: string, deviceId: string }} data
     */
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
        this.deviceId = data.deviceId;

        Object.freeze(this);
    }

    /**
     * @param {{ email: string, password: string, deviceId: string }} data
     * @returns {LoginRequestDto}
     */
    static from(data) {
        return new LoginRequestDto(data);
    }
}
