/**
 * Auth-bounded-context domain entity.
 *
 * Only carries the fields required to authenticate a principal: credential
 * data (email, hashed password) and verification status.  Profile data
 * (username, displayName, dateOfBirth, …) is owned by the user bounded context
 * and is not represented here.
 */
export class AuthUser {
    constructor({
        id,
        email,
        password,
        isVerified = false,
        createdAt = null,
        updatedAt = null,
    } = {}) {
        this.id = id;
        this.email = email;
        this.isVerified = isVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        // Hide `password` from enumeration (JSON.stringify, Object.keys, console/logger iteration)
        Object.defineProperty(this, 'password', {
            value: password,
            enumerable: false,
            writable: false,
            configurable: false,
        });

        Object.freeze(this);
    }
}
