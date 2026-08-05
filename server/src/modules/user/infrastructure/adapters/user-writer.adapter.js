import { UserWriterPort } from '../../application/ports/user-writer.port.js';
import { AppError, ErrorCode } from '../../../../shared/error/index.js';
import { UserMapper } from '../mappers/user.mapper.js';
import {
    PROFILE_ALREADY_EXISTS,
    USERNAME_ALREADY_TAKEN,
} from '../../domain/user.constant.js';

const parseDuplicateKeyError = err => {
    const keyPattern = err.keyPattern || {};
    const keyValue = err.keyValue || {};
    const message = err.message || '';

    if (
        keyPattern.username ||
        keyValue.username ||
        message.includes('username')
    ) {
        return USERNAME_ALREADY_TAKEN;
    }
    if (keyPattern.authId || keyValue.authId || message.includes('authId')) {
        return PROFILE_ALREADY_EXISTS;
    }
    return PROFILE_ALREADY_EXISTS;
};

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
                const errorMessage = parseDuplicateKeyError(err);
                throw new AppError(errorMessage, ErrorCode.ALREADY_EXISTS);
            }
            throw err;
        }
    }
}
