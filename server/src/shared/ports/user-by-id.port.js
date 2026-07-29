/**
 * Narrow ISP-compliant port for any consumer that only needs to look up a
 * single user by their primary identifier.
 *
 * Lives in the shared layer so cross-cutting infrastructure (e.g. the
 * `authenticate` middleware) can declare its minimal dependency without
 * coupling to the user module's broader `UserReaderPort`.
 */
export class UserByIdPort {
    findById(_id) {
        throw new Error('Method not implemented');
    }

    findByAuthId(_authId) {
        throw new Error('Method not implemented');
    }
}
