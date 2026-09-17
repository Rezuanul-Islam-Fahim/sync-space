/**
 * Presentation DTO for parsing logout requests.
 */
export class LogoutRequestDto {
    /**
     * @param {{ refreshToken: string }} data
     */
    constructor({ refreshToken }) {
        this.refreshToken = refreshToken;
    }

    /**
     * @param {{ refreshToken: string }} data
     * @returns {LogoutRequestDto}
     */
    static from(data) {
        return new LogoutRequestDto(data);
    }
}
