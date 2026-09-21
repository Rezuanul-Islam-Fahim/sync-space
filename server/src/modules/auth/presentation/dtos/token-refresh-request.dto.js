/**
 * Presentation DTO for parsing token refresh requests.
 */
export class TokenRefreshRequestDto {
    /**
     * @param {{ refreshToken: string }} data
     */
    constructor({ refreshToken }) {
        this.refreshToken = refreshToken;
    }

    /**
     * @param {{ refreshToken: string }} data
     * @returns {TokenRefreshRequestDto}
     */
    static from(data) {
        return new TokenRefreshRequestDto(data);
    }
}
