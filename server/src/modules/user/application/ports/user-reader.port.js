import { UserByIdPort } from '../../../../shared/ports/index.js';

/**
 * Full user-read port.  Extends `UserByIdPort` so that any `UserReaderPort`
 * implementation automatically satisfies the narrower port used by the
 * authenticate middleware (Interface Segregation Principle).
 */
export class UserReaderPort extends UserByIdPort {
    findByEmail(_email) {
        throw new Error('Method not implemented');
    }

    // findById is inherited from UserByIdPort

    findByUsername(_username) {
        throw new Error('Method not implemented');
    }
}
