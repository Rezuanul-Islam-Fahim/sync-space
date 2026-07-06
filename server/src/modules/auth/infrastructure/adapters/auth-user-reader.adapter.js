import { AuthUserReaderPort } from '../../application/ports/auth-user-reader.port.js';

export class AuthUserReaderAdapter extends AuthUserReaderPort {
    constructor({ userReader }) {
        super();
        this.userReader = userReader;
    }

    findByEmailWithPassword = async email => {
        return this.userReader.findByEmailWithPassword(email);
    };

    findByUsername = async username => {
        return this.userReader.findByUsername(username);
    };
}
