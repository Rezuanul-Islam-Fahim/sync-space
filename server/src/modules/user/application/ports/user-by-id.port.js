/**
 * Narrow ISP-compliant port for any consumer that only needs to look up a
 * single user by their primary identifier.
 *
 * Keeping this in the shared layer lets cross-cutting middleware (e.g. the
 * `authenticate` middleware) declare its minimal dependency without coupling
 * to the user module's broader `UserReaderPort`.
 */
export class UserByIdPort {
    findById(_id) {
        throw new Error('Method not implemented');
    }
}
