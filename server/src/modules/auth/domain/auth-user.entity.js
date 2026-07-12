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
    }

    async verifyPassword(plainPassword, passwordHasher) {
        if (!this.password) return false;
        return passwordHasher.compare(plainPassword, this.password);
    }

    static async create(data, passwordHasher) {
        const hashedPassword = await passwordHasher.hash(data.password);
        return new AuthUser({
            email: data.email,
            username: data.username,
            password: hashedPassword,
            isVerified: false,
        });
    }
}
