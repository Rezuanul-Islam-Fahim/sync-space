import { UserWriterPort } from '../../application/ports/user-writer.port.js';
import { AppError, ErrorCode } from '../../../../shared/error/index.js';
import { UserMapper } from '../mappers/user.mapper.js';

export class UserWriterAdapter extends UserWriterPort {
    constructor({ userModel }) {
        super();
        this.userModel = userModel;
    }

    async createUser(user) {
        try {
            const persistenceData = UserMapper.toPersistence(user);
            const profile = new this.userModel(persistenceData);
            const savedDoc = await profile.save();
            return UserMapper.toDomain(savedDoc);
        } catch (err) {
            if (err.code === 11000) {
                // MongoDB duplicate key error
                throw new AppError(
                    'Profile already exists',
                    ErrorCode.ALREADY_EXISTS
                );
            }
            throw err;
        }
    }
}
