import bcrypt from 'bcrypt';
import {
    PasswordHasherPort,
    PasswordComparerPort,
} from '../../application/ports/password-hasher.port.js';

/**
 * Adapter implementing PasswordHasherPort using bcrypt for password hashing.
 */
export class BcryptPasswordHasher extends PasswordHasherPort {
    /**
     * @param {{ saltRounds?: number }} [options]
     */
    constructor({ saltRounds = 12 } = {}) {
        super();
        this.saltRounds = saltRounds;
    }

    /**
     * Hashes a plain-text password using bcrypt.
     *
     * @param {string} password
     * @returns {Promise<string>}
     */
    async hash(password) {
        return await bcrypt.hash(password, this.saltRounds);
    }
}

/**
 * Adapter implementing PasswordComparerPort using bcrypt for password verification.
 */
export class BcryptPasswordComparer extends PasswordComparerPort {
    /**
     * Compares a plain-text password against a hashed password.
     *
     * @param {string} password
     * @param {string} hashedPassword
     * @returns {Promise<boolean>}
     */
    async compare(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}
