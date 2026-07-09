import { AuthUserResponseDto } from './auth-user-response.dto.js';

export class LoginResponseDto {
    constructor({ user, tokens }) {
        this.user = AuthUserResponseDto.from(user);
        this.tokens = tokens;
    }

    static from(loginData) {
        return new LoginResponseDto(loginData);
    }
}
