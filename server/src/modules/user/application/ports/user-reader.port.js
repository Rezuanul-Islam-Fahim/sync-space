/**
 * Port for querying a user profile by primary ID (ISP segregated).
 */
export class UserByIdReaderPort {
    /**
     * @param {string} _id
     * @returns {Promise<import('../../domain/user.entity.js').User | null>}
     */
    findById(_id) {
        throw new Error('Method not implemented');
    }
}

/**
 * Port for querying a user profile by associated Auth credential ID (ISP segregated).
 */
export class UserByAuthIdReaderPort {
    /**
     * @param {string} _authId
     * @returns {Promise<import('../../domain/user.entity.js').User | null>}
     */
    findByAuthId(_authId) {
        throw new Error('Method not implemented');
    }
}

/**
 * Port for querying a user profile by unique username (ISP segregated).
 */
export class UserByUsernameReaderPort {
    /**
     * @param {string} _username
     * @returns {Promise<import('../../domain/user.entity.js').User | null>}
     */
    findByUsername(_username) {
        throw new Error('Method not implemented');
    }
}

/**
 * Full composite user-read port combining all query methods.
 */
export class UserReaderPort {
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
