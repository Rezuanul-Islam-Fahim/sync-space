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
        id = null,
        email,
        password,
        isVerified = false,
        createdAt = null,
        updatedAt = null,
    } = {}) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.isVerified = isVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        Object.freeze(this);
    }

    /**
     * Factory method for instantiating a new AuthUser domain entity prior to persistence.
     *
     * @param {{ email: string, password: string, isVerified?: boolean }} props
     * @returns {AuthUser}
     */
    static create({ email, password, isVerified = false }) {
        return new AuthUser({
            email,
            password,
            isVerified,
        });
    }
}
