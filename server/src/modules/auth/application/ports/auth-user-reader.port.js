/**
 * Auth module's inbound read port.
 *
 * Extends the shared user reader contract so auth infrastructure can look up
 * users by email and id without depending on the concrete model layer.
 */
export class AuthUserReaderPort {
    findByEmail(_email) {
        throw new Error('Method not implemented');
    }

    findById(_id) {
        throw new Error('Method not implemented');
    }
}
