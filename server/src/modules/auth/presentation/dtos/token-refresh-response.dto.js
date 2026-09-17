/**
 * Presentation DTO for returning new tokens after a successful refresh.
 */
export class TokenRefreshResponseDto {
    /**
     * @param {{ accessToken: string, refreshToken: string }} data
     */
    constructor({ accessToken, refreshToken }) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    /**
     * @param {{ accessToken: string, refreshToken: string }} data
     * @returns {TokenRefreshResponseDto}
     */
    static from(data) {
        return new TokenRefreshResponseDto(data);
    }
}
