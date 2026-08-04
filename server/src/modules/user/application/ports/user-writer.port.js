export class UserWriterPort {
    /**
     * Persists a new user profile.
     *
     * @param {import('../../domain/user.entity.js').User} _user
     * @returns {Promise<import('../../domain/user.entity.js').User>}
     */
    createUser(_user) {
        throw new Error('Method not implemented');
    }
}
