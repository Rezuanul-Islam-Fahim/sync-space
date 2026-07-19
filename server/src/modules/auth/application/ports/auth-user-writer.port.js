export class AuthUserWriterPort {
    /**
     * Persists a new user from the given fully-populated domain entity.
     * All fields required at registration time must already be present on the entity.
     *
     * @param {import('../../domain/auth-user.entity.js').AuthUser} _authUser
     */
    createUser(_authUser) {
        throw new Error('Method not implemented');
    }

    deleteById(_id) {
        throw new Error('Method not implemented');
    }
}
