import { AuthUserReaderPort } from '../../application/ports/auth-user-reader.port.js';
import { AuthUser } from '../../domain/auth-user.entity.js';

export class AuthUserReaderAdapter extends AuthUserReaderPort {
    constructor({ userModel }) {
        super();
        this.userModel = userModel;
    }

    findByEmail = async email => {
        const user = await this.userModel
            .findOne({ email })
            .select('-password')
            .lean();
        return user ? new AuthUser(user) : null;
    };

    findByEmailWithPassword = async email => {
        const user = await this.userModel.findOne({ email }).lean();
        return user ? new AuthUser(user) : null;
    };

    findByUsername = async username => {
        const user = await this.userModel
            .findOne({ username })
            .select('-password')
            .lean();
        return user ? new AuthUser(user) : null;
    };
}
