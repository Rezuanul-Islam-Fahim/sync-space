export class AuthUserWriterPort {
    /**
     * Persists authentication credentials from the given fully-populated AuthUser domain entity.
     * All fields required at credential creation time must already be present on the entity.
     *
     * @param {import('../../domain/auth-user.entity.js').AuthUser} _authUser
     * @returns {Promise<import('../../domain/auth-user.entity.js').AuthUser>}
     */
    createUser(_authUser) {
        throw new Error('Method not implemented');
    }

    /**
     * @param {string} _id
     * @returns {Promise<void>}
     */
    deleteById(_id) {
        throw new Error('Method not implemented');
    }
}
