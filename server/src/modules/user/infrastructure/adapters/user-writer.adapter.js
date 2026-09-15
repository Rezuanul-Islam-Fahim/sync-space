import { UserWriterPort } from '../../application/ports/user-writer.port.js';
import { ConflictError } from '../../../../shared/error/index.js';
import { UserMapper } from '../mappers/user.mapper.js';
import {
    PROFILE_ALREADY_EXISTS,
    USERNAME_ALREADY_TAKEN,
} from '../../domain/user.constant.js';

/**
 * Resolves appropriate domain error message from a MongoDB duplicate key error.
 *
 * @param {any} err
 * @returns {string}
 */
const parseDuplicateKeyError = err => {
    const keyPattern = err.keyPattern || {};
    const keyValue = err.keyValue || {};

    if ('username' in keyPattern || 'username' in keyValue) {
        return USERNAME_ALREADY_TAKEN;
    }
    if ('authId' in keyPattern || 'authId' in keyValue) {
        return PROFILE_ALREADY_EXISTS;
    }
    return PROFILE_ALREADY_EXISTS;
};

/**
 * Writes user profile documents to the database via UserModel.
 */
export class UserWriterAdapter extends UserWriterPort {
    /**
     * @param {{ userModel: import('mongoose').Model<any> }} deps
     */
    constructor({ userModel }) {
        super();
        this.userModel = userModel;
    }

    /**
     * Persists a new user profile to the database.
     *
     * @param {import('../../domain/user.entity.js').User} user
     * @returns {Promise<import('../../domain/user.entity.js').User>}
     */
    async createUser(user) {
        try {
            const persistenceData = UserMapper.toPersistence(user);
            const profile = new this.userModel(persistenceData);
            const savedDoc = await profile.save();
            return UserMapper.toDomain(savedDoc);
        } catch (err) {
            if (err.code === 11000) {
                const errorMessage = parseDuplicateKeyError(err);
                throw new ConflictError(errorMessage);
            }
            throw err;
        }
    }
}
