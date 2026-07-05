export class User {
    constructor({
        id,
        email,
        username,
        password,
        displayName = null,
        avatar = null,
        bio = null,
        banner = null,
        bannerColor = '#5865F2',
        dateOfBirth,
        isVerified = false,
        status = 'offline',
        lastOnline = null,
        createdAt,
        updatedAt,
    }) {
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

    excludePassword() {
        const props = { ...this };
        delete props.password;
        return new User(props);
    }
}
