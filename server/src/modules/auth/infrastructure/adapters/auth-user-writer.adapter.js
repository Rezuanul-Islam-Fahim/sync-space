import { AuthUserWriterPort } from '../../application/ports/auth-user-writer.port.js';
import { AuthUserMapper } from '../mappers/auth-user.mapper.js';
import { ConflictError } from '../../../../shared/error/index.js';
import { EMAIL_ALREADY_REGISTERED } from '../../domain/auth-user.constant.js';

/**
 * Writes credential documents to the `credentials` collection via
 * `AuthUserModel`.  Lives inside the auth module — no dependency on the
 * user module.
 */
export class AuthUserWriterAdapter extends AuthUserWriterPort {
    /**
     * @param {{ authUserModel: import('mongoose').Model<any> }} deps
     */
    constructor({ authUserModel }) {
        super();
        this.authUserModel = authUserModel;
    }

    /**
     * Persists new auth credentials to the database.
     *
     * @param {import('../../domain/auth-user.entity.js').AuthUser} authUser
     * @returns {Promise<import('../../domain/auth-user.entity.js').AuthUser>}
     */
    async createUser(authUser) {
        try {
            const persistenceData = AuthUserMapper.toPersistence(authUser);
            const newDoc = new this.authUserModel(persistenceData);
            const savedDoc = await newDoc.save();
            return AuthUserMapper.toDomain(savedDoc);
        } catch (err) {
            if (err.code === 11000) {
                // MongoDB duplicate key error
                throw new ConflictError(EMAIL_ALREADY_REGISTERED);
            }
            throw err;
        }
    }

    /**
     * Deletes auth credentials by ID.
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async deleteById(id) {
        await this.authUserModel.findByIdAndDelete(id);
    }
}
