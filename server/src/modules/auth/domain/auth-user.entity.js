export class AuthUser {
    constructor({
        id,
        email,
        username,
        password,
        isVerified = false,
        displayName = null,
        dateOfBirth = null,
    } = {}) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.isVerified = isVerified;
        this.displayName = displayName;
        this.dateOfBirth = dateOfBirth;
        Object.freeze(this);
    }
}
