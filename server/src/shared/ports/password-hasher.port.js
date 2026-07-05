export class PasswordHasherPort {
    hash(_password, _saltRounds) {
        throw new Error('Method not implemented');
    }

    compare(_password, _hashedPassword) {
        throw new Error('Method not implemented');
    }
}
