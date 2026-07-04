import bcrypt from 'bcrypt';

export class BcryptPasswordHasher {
    hash = async (password, saltRounds) => {
        return await bcrypt.hash(password, saltRounds);
    };

    compare = async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    };
}
