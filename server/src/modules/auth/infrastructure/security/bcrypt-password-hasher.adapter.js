import bcrypt from 'bcrypt';
import {
    PasswordHasherPort,
    PasswordComparerPort,
} from '../../application/ports/password-hasher.port.js';

export class BcryptPasswordHasher extends PasswordHasherPort {
    /**
     * @param {{ saltRounds?: number }} [options]
     */
    constructor({ saltRounds = 12 } = {}) {
        super();
        this.saltRounds = saltRounds;
    }

    async hash(password) {
        return await bcrypt.hash(password, this.saltRounds);
    }
}

export class BcryptPasswordComparer extends PasswordComparerPort {
    async compare(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}
