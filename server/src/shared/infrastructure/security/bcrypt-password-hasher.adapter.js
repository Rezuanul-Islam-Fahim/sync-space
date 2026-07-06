import bcrypt from 'bcrypt';
import { PasswordHasherPort } from '../../index.js';

export class BcryptPasswordHasher extends PasswordHasherPort {
    constructor({ saltRounds } = {}) {
        super();
        this.saltRounds = saltRounds || 10;
    }

    async hash(password) {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async compare(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}
