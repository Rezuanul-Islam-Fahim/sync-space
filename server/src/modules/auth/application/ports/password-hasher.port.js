/**
 * Port for hashing raw password strings (ISP segregated).
 */
export class PasswordHasherPort {
    /**
     * @param {string} _password
     * @returns {Promise<string>}
     */
    hash(_password) {
        throw new Error('Method not implemented');
    }
}

/**
 * Port for comparing plain-text passwords against hashed password strings (ISP segregated).
 */
export class PasswordComparerPort {
    /**
     * @param {string} _password
     * @param {string} _hashedPassword
     * @returns {Promise<boolean>}
     */
    compare(_password, _hashedPassword) {
        throw new Error('Method not implemented');
    }
}
