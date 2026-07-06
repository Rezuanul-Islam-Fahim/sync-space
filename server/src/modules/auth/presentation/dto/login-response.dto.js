import { UserDto } from '../../../user/index.js';

export class LoginResponseDto {
    constructor({ user, tokens }) {
        this.user = UserDto.from(user);
        this.tokens = tokens;
    }

    static from(loginData) {
        return new LoginResponseDto(loginData);
    }
}
