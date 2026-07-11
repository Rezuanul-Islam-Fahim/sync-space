export class AuthUser {
    constructor({
        id,
        email,
        username,
        password,
        displayName = null,
        avatar = null,
        bio = null,
        banner = null,
        bannerColor = null,
        dateOfBirth = null,
        isVerified = false,
        status = null,
        lastOnline = null,
        createdAt = null,
        updatedAt = null,
    } = {}) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.displayName = displayName;
        this.avatar = avatar;
        this.bio = bio;
        this.banner = banner;
        this.bannerColor = bannerColor;
        this.dateOfBirth = dateOfBirth;
        this.isVerified = isVerified;
        this.status = status;
        this.lastOnline = lastOnline;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        Object.freeze(this);
    }
}
