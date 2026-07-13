export class AuthUser {
    constructor({
        id,
        email,
        username,
        password,
        isVerified = false,
        createdAt = null,
        updatedAt = null,
    } = {}) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.isVerified = isVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        Object.freeze(this);
    }
}
