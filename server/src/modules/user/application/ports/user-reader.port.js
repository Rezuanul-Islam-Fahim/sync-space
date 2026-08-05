/**
 * Full user-read port.
 */
export class UserReaderPort {
    /**
     * @param {string} _email
     * @returns {Promise<import('../../domain/user.entity.js').User | null>}
     */
    findByEmail(_email) {
        throw new Error('Method not implemented');
    }

    /**
     * @param {string} _id
     * @returns {Promise<import('../../domain/user.entity.js').User | null>}
     */
    findById(_id) {
        throw new Error('Method not implemented');
    }

    /**
     * @param {string} _authId
     * @returns {Promise<import('../../domain/user.entity.js').User | null>}
     */
    findByAuthId(_authId) {
        throw new Error('Method not implemented');
    }

    /**
     * @param {string} _username
     * @returns {Promise<import('../../domain/user.entity.js').User | null>}
     */
    findByUsername(_username) {
        throw new Error('Method not implemented');
    }
}
