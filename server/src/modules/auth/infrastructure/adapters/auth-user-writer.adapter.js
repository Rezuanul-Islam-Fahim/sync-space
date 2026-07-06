import { AuthUserWriterPort } from '../../application/ports/auth-user-writer.port.js';

export class AuthUserWriterAdapter extends AuthUserWriterPort {
    constructor({ userWriter }) {
        super();
        this.userWriter = userWriter;
    }

    createUser = async userData => {
        return this.userWriter.createUser(userData);
    };
}
