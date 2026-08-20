import { AuthUserResponseDto } from './auth-user-response.dto.js';

/**
 * Presentation DTO for the login endpoint response payload.
 */
export class LoginResponseDto {
    /**
     * @param {{
     *   user: import('../../domain/auth-user.entity.js').AuthUser | object,
     *   tokens: { token: string, refreshToken: string }
     * }} loginData
     */
    constructor({ user, tokens }) {
        this.user = AuthUserResponseDto.from(user);
        this.tokens = tokens;
    }

    /**
     * @param {{
     *   user: import('../../domain/auth-user.entity.js').AuthUser | object,
     *   tokens: { token: string, refreshToken: string }
     * }} loginData
     * @returns {LoginResponseDto}
     */
    static from(loginData) {
        return new LoginResponseDto(loginData);
    }
}
