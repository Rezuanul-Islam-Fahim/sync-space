import { AuthUserWriterPort } from '../../application/ports/auth-user-writer.port.js';
import { AuthUserMapper } from '../mappers/auth-user.mapper.js';

/**
 * Writes credential documents to the `credentials` collection via
 * `AuthUserModel`.  Lives inside the auth module — no dependency on the
 * user module.
 */
export class AuthUserWriterAdapter extends AuthUserWriterPort {
    constructor({ authUserModel }) {
        super();
        this.authUserModel = authUserModel;
    }

    createUser = async authUser => {
        const persistenceData = AuthUserMapper.toPersistence(authUser);
        const newDoc = new this.authUserModel(persistenceData);
        const savedDoc = await newDoc.save();
        return AuthUserMapper.toDomain(savedDoc);
    };

    deleteById = async id => {
        await this.authUserModel.findByIdAndDelete(id);
    };
}
