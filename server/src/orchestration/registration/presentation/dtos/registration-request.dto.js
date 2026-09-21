/**
 * Presentation DTO for parsing registration request body payload.
 */
export class RegistrationRequestDto {
    /**
     * @param {{
     *   email: string,
     *   username: string,
     *   displayName?: string,
     *   dateOfBirth: Date | string,
     *   password: string
     * }} data
     */
    constructor(data) {
        this.email = data.email;
        this.username = data.username;
        this.displayName = data.displayName;
        this.dateOfBirth = data.dateOfBirth;
        this.password = data.password;

        Object.freeze(this);
    }

    /**
     * @param {{
     *   email: string,
     *   username: string,
     *   displayName?: string,
     *   dateOfBirth: Date | string,
     *   password: string
     * }} body
     * @returns {RegistrationRequestDto}
     */
    static from(body) {
        return new RegistrationRequestDto(body);
    }
}
