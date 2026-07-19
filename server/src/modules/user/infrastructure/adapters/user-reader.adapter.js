import { UserReaderPort } from '../../application/ports/user-reader.port.js';
import { UserMapper } from '../mappers/user.mapper.js';

export class UserReaderAdapter extends UserReaderPort {
    constructor({ userModel }) {
        super();
        this.userModel = userModel;
    }

    findByEmail = async email => {
        const user = await this.userModel.findOne({ email }).lean();
        return UserMapper.toDomain(user);
    };

    findById = async id => {
        const user = await this.userModel.findById(id).lean();
        return UserMapper.toDomain(user);
    };

    findByUsername = async username => {
        const user = await this.userModel.findOne({ username }).lean();
        return UserMapper.toDomain(user);
    };
}
