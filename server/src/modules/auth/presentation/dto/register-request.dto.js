import { REGISTER_ALLOWED_FIELDS } from '../../domain/auth.constant.js';
import { allowedFieldsFilter } from '../../../../shared/index.js';

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
