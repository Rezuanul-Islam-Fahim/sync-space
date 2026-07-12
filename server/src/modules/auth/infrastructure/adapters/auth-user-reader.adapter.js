import { AuthUserReaderPort } from '../../application/ports/auth-user-reader.port.js';
import { AuthUserMapper } from '../mappers/auth-user.mapper.js';

export class AuthUserReaderAdapter extends AuthUserReaderPort {
    constructor({ userModel }) {
        super();
        this.userModel = userModel;
    }

    findByEmail = async email => {
        const user = await this.userModel.findOne({ email }).lean();
        return AuthUserMapper.toDomain(user);
    };

    findByUsername = async username => {
        const user = await this.userModel.findOne({ username }).lean();
        return AuthUserMapper.toDomain(user);
    };
}
