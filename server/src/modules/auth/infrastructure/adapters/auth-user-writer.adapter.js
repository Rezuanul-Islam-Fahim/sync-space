import { AuthUserWriterPort } from '../../application/ports/auth-user-writer.port.js';
import { AuthUser } from '../../domain/auth-user.entity.js';

export class AuthUserWriterAdapter extends AuthUserWriterPort {
    constructor({ userWriter }) {
        super();
        this.userWriter = userWriter;
    }

    createUser = async userData => {
        const user = await this.userWriter.createUser(userData);
        return user ? new AuthUser(user) : null;
    };
}

