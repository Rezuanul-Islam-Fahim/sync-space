import { AuthUserReaderPort } from '../../application/ports/auth-user-reader.port.js';
import { AuthUserMapper } from '../mappers/auth-user.mapper.js';

/**
 * Reads credential documents from the `credentials` collection via
 * `AuthUserModel`.  Lives inside the auth module so that the user module
 * carries zero knowledge of credential storage.
 */
export class AuthUserReaderAdapter extends AuthUserReaderPort {
    /**
     * @param {{ authUserModel: import('mongoose').Model<any> }} deps
     */
    constructor({ authUserModel }) {
        super();
        this.authUserModel = authUserModel;
    }

    /**
     * Finds auth credentials by email.
     *
     * @param {string} email
     * @returns {Promise<import('../../domain/auth-user.entity.js').AuthUser | null>}
     */
    async findByEmail(email) {
        const doc = await this.authUserModel.findOne({ email }).lean();
        return AuthUserMapper.toDomain(doc);
    }

    /**
     * Finds auth credentials by ID.
     *
     * @param {string} id
     * @returns {Promise<import('../../domain/auth-user.entity.js').AuthUser | null>}
     */
    async findById(id) {
        const doc = await this.authUserModel.findById(id).lean();
        return AuthUserMapper.toDomain(doc);
    }
}
