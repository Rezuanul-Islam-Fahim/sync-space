import { UserReaderPort } from '../../application/ports/user-reader.port.js';
import { UserMapper } from '../mappers/user.mapper.js';

export class UserReaderAdapter extends UserReaderPort {
    constructor({ userModel }) {
        super();
        this.userModel = userModel;
    }

    async findByAuthId(authId) {
        const user = await this.userModel.findOne({ authId }).lean();
        return UserMapper.toDomain(user);
    }

    async findById(id) {
        const user = await this.userModel.findOne({ _id: id }).lean();
        return UserMapper.toDomain(user);
    }

    async findByUsername(username) {
        const user = await this.userModel.findOne({ username }).lean();
        return UserMapper.toDomain(user);
    }
}
