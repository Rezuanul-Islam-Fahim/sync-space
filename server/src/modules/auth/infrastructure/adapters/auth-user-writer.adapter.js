import { AuthUserWriterPort } from '../../application/ports/auth-user-writer.port.js';
import { AuthUserMapper } from '../mappers/auth-user.mapper.js';

export class AuthUserWriterAdapter extends AuthUserWriterPort {
    constructor({ userModel }) {
        super();
        this.userModel = userModel;
    }

    createUser = async authUser => {
        const persistenceData = AuthUserMapper.toPersistence(authUser);
        const newUser = new this.userModel(persistenceData);
        const savedUser = await newUser.save();
        return AuthUserMapper.toDomain(savedUser);
    };
}
