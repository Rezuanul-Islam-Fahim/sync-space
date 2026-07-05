export class User {
    constructor({
        id,
        email,
        username,
        password,
        displayName,
        avatar,
        bio,
        banner,
        bannerColor,
        dateOfBirth,
        isVerified,
        status,
        lastOnline,
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
    }
}
