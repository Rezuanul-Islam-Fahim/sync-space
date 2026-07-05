import { AuthUserReaderPort } from '../../application/ports/auth-user-reader.port.js';
import { AuthUserWriterPort } from '../../application/ports/auth-user-writer.port.js';

export class UserReaderAdapter extends AuthUserReaderPort {
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

export class UserWriterAdapter extends AuthUserWriterPort {
    constructor({ userWriter }) {
        super();
        this.userWriter = userWriter;
    }

    createUser = async userData => {
        return this.userWriter.createUser(userData);
    };
}
