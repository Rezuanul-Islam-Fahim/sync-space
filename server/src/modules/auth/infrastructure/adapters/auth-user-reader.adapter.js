import { AuthUserReaderPort } from '../../application/ports/auth-user-reader.port.js';
import { AuthUser } from '../../domain/auth-user.entity.js';

export class AuthUserReaderAdapter extends AuthUserReaderPort {
    constructor({ userReader }) {
        super();
        this.userReader = userReader;
    }

    findByEmailWithPassword = async email => {
        const user = await this.userReader.findByEmailWithPassword(email);
        return user ? new AuthUser(user) : null;
    };

    findByUsername = async username => {
        const user = await this.userReader.findByUsername(username);
        return user ? new AuthUser(user) : null;
    };
}

