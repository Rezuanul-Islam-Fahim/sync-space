import bcrypt from 'bcrypt';

export default class BcryptPasswordHasher {
    hash = async (password, saltRounds) => {
        return await bcrypt.hash(password, saltRounds);
    };

    compare = async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    };
}
