import {
    LOGIN_ALLOWED_FIELDS,
    REGISTER_ALLOWED_FIELDS,
} from './auth.constant.js';
import allowedFieldsFilter from '../../utils/allowed-fields-filter.js';

export class RegisterRequestDto {
    constructor(data) {
        this.email = data.email;
        this.username = data.username;
        this.password = data.password;
        this.displayName = data.displayName;
        this.avatar = data.avatar;
        this.bio = data.bio;
        this.banner = data.banner;
        this.bannerColor = data.bannerColor;
        this.dateOfBirth = data.dateOfBirth;
        this.isVerified = data.isVerified;
        this.status = data.status;
        this.lastOnline = data.lastOnline;
    }

    static from(body) {
        return new RegisterRequestDto(
            allowedFieldsFilter(body, REGISTER_ALLOWED_FIELDS)
        );
    }
}

export { UserDto as RegisterResponseDto } from '../user/index.js';

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
