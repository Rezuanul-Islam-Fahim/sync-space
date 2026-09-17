import { UserReaderPort } from '../../application/ports/user-reader.port.js';
import { UserMapper } from '../mappers/user.mapper.js';

/**
 * Reads user profile documents from the database via UserModel.
 */
export class UserReaderAdapter extends UserReaderPort {
    /**
     * @param {{ userModel: import('mongoose').Model<any> }} deps
     */
    constructor({ userModel }) {
        super();
        this.userModel = userModel;
    }

    /**
     * Finds a user profile by auth credential ID.
     *
     * @param {string} authId
     * @returns {Promise<import('../../domain/user.entity.js').User | null>}
     */
    async findByAuthId(authId) {
        const user = await this.userModel.findOne({ authId }).lean();
        return UserMapper.toDomain(user);
    }

    /**
     * Finds a user profile by ID.
     *
     * @param {string} id
     * @returns {Promise<import('../../domain/user.entity.js').User | null>}
     */
    async findById(id) {
        const user = await this.userModel.findById(id).lean();
        return UserMapper.toDomain(user);
    }

    /**
     * Finds a user profile by username.
     *
     * @param {string} username
     * @returns {Promise<import('../../domain/user.entity.js').User | null>}
     */
    async findByUsername(username) {
        const user = await this.userModel.findOne({ username }).lean();
        return UserMapper.toDomain(user);
    }
}
