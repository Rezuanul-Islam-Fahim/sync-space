import {
    LOGIN_ALLOWED_FIELDS,
    REGISTER_ALLOWED_FIELDS,
} from '../auth.constant.js';
import { allowedFieldsFilter } from '../../../shared/index.js';
import { UserDto } from '../../user/index.js';

export class RegisterRequestDto {
    constructor(data) {
        this.email = data.email;
        this.username = data.username;
        this.password = data.password;
        this.displayName = data.displayName;
        this.dateOfBirth = data.dateOfBirth;
    }

    static from(body) {
        return new RegisterRequestDto(
            allowedFieldsFilter(body, REGISTER_ALLOWED_FIELDS)
        );
    }
}

export { UserDto as RegisterResponseDto };

export class LoginRequestDto {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
    }

    static from(data) {
        return new LoginRequestDto(
            allowedFieldsFilter(data, LOGIN_ALLOWED_FIELDS)
        );
    }
}

export class LoginResponseDto {
    constructor({ user, tokens }) {
        this.user = UserDto.from(user);
        this.tokens = tokens;
    }

    static from(loginData) {
        return new LoginResponseDto(loginData);
    }
}
