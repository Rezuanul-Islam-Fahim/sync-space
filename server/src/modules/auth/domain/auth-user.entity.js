export class AuthUser {
    constructor({ id, email, username, password, isVerified = false } = {}) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.isVerified = isVerified;
        Object.freeze(this);
    }
}
