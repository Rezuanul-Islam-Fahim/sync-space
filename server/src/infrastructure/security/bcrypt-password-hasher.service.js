import bcrypt from 'bcrypt';
import { PasswordHasherPort } from '../../shared/ports/password-hasher.port.js';

export default class BcryptPasswordHasher extends PasswordHasherPort {
    hash = async (password, saltRounds) => {
        return await bcrypt.hash(password, saltRounds);
    };

    compare = async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    };
}
