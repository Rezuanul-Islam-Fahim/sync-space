export class AuthUserProviderPort {
    createUser(_userData) {
        throw new Error('Method not implemented');
    }

    findByEmail(_email) {
        throw new Error('Method not implemented');
    }

    findByUsername(_username) {
        throw new Error('Method not implemented');
    }

    validateCredentials(_email, _password) {
        throw new Error('Method not implemented');
    }
}
