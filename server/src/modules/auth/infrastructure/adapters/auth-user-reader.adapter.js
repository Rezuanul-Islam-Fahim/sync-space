import { AuthUserReaderPort } from '../../application/ports/auth-user-reader.port.js';
import { AuthUserMapper } from '../mappers/auth-user.mapper.js';

export class AuthUserReaderAdapter extends AuthUserReaderPort {
    constructor({ userModel }) {
        super();
        this.userModel = userModel;
    }

    /**
     * Credential reads intentionally omit `.select('-password')` so that the
     * hashed password is available for comparison during authentication flows.
     */
    findByEmail = async email => {
        const user = await this.userModel.findOne({ email }).lean();
        return AuthUserMapper.toDomain(user);
    };

    findByUsername = async username => {
        const user = await this.userModel.findOne({ username }).lean();
        return AuthUserMapper.toDomain(user);
    };

    // Implements UserByIdPort (inherited via AuthUserReaderPort) — includes
    // password so auth-layer callers have the full credential document.
    findById = async id => {
        const user = await this.userModel.findById(id).lean();
        return AuthUserMapper.toDomain(user);
    };
}
