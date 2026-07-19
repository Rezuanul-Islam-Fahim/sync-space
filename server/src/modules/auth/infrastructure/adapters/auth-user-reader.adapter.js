import { AuthUserReaderPort } from '../../application/ports/auth-user-reader.port.js';
import { AuthUserMapper } from '../mappers/auth-user.mapper.js';

/**
 * Reads credential documents from the `credentials` collection via
 * `AuthUserModel`.  Lives inside the auth module so that the user module
 * carries zero knowledge of credential storage.
 */
export class AuthUserReaderAdapter extends AuthUserReaderPort {
    constructor({ authUserModel }) {
        super();
        this.authUserModel = authUserModel;
    }

    findByEmail = async email => {
        const doc = await this.authUserModel.findOne({ email }).lean();
        return AuthUserMapper.toDomain(doc);
    };

    // Implements UserByIdPort (inherited via AuthUserReaderPort)
    findById = async id => {
        const doc = await this.authUserModel.findById(id).lean();
        return AuthUserMapper.toDomain(doc);
    };
}
