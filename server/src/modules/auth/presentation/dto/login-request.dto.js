import { LOGIN_ALLOWED_FIELDS } from '../../domain/auth.constant.js';
import { allowedFieldsFilter } from '../../../../shared/index.js';

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
