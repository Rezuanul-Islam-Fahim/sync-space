/**
 * Port for querying an auth user by email (ISP segregated).
 */
export class AuthUserByEmailReaderPort {
    /**
     * @param {string} _email
     * @returns {Promise<import('../../domain/auth-user.entity.js').AuthUser | null>}
     */
    findByEmail(_email) {
        throw new Error('Method not implemented');
    }
}

/**
 * Port for querying an auth user by primary ID (ISP segregated).
 */
export class AuthUserByIdReaderPort {
    /**
     * @param {string} _id
     * @returns {Promise<import('../../domain/auth-user.entity.js').AuthUser | null>}
     */
    findById(_id) {
        throw new Error('Method not implemented');
    }
}

/**
 * Composite read port for querying authentication credentials by email and ID
 * without depending on the concrete model layer.
 */
export class AuthUserReaderPort {
    /**
     * @param {string} _email
     * @returns {Promise<import('../../domain/auth-user.entity.js').AuthUser | null>}
     */
    findByEmail(_email) {
        throw new Error('Method not implemented');
    }

    /**
     * @param {string} _id
     * @returns {Promise<import('../../domain/auth-user.entity.js').AuthUser | null>}
     */
    findById(_id) {
        throw new Error('Method not implemented');
    }
}
