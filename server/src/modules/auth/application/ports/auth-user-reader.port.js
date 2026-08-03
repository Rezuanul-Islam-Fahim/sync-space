/**
 * Auth module's read port for querying authentication credentials by email and ID
 * without depending on the concrete model layer.
 */
export class AuthUserReaderPort {
    findByEmail(_email) {
        throw new Error('Method not implemented');
    }

    findById(_id) {
        throw new Error('Method not implemented');
    }
}
