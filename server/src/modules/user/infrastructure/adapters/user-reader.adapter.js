import { UserReaderPort } from '../../application/ports/user-reader.port.js';
import { UserMapper } from '../mappers/user.mapper.js';

export class UserReaderAdapter extends UserReaderPort {
    constructor({ userModel }) {
        super();
        this.userModel = userModel;
    }

    async findOne(criteria) {
        if (!criteria || Object.keys(criteria).length === 0) return null;

        const query = { ...criteria };
        if (query.id) {
            query._id = query.id;
            delete query.id;
        }

        const user = await this.userModel.findOne(query).lean();
        return UserMapper.toDomain(user);
    }

    async findByAuthId(authId) {
        return this.findOne({ authId });
    }

    async findByEmail(email) {
        return this.findOne({ email });
    }

    async findById(id) {
        return this.findOne({ id });
    }

    async findByUsername(username) {
        return this.findOne({ username });
    }
}
