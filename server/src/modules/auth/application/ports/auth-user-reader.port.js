import { UserByIdPort } from '../../../../shared/ports/index.js';

/**
 * Auth module's inbound read port.
 *
 * Extends `UserByIdPort` so that any `AuthUserReaderPort` implementation
 * automatically satisfies the narrow cross-cutting port used by infrastructure
 * that only needs to look up a user by id (e.g. token-verification helpers).
 */
export class AuthUserReaderPort extends UserByIdPort {
    findByEmail(_email) {
        throw new Error('Method not implemented');
    }

    // findById is inherited from UserByIdPort
}
