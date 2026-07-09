export class AuthUserResponseDto {
    constructor(user) {
        this.id = user.id?.toString();
        this.email = user.email;
        this.username = user.username;
        this.displayName = user.displayName;
        this.avatar = user.avatar;
        this.bio = user.bio;
        this.banner = user.banner;
        this.bannerColor = user.bannerColor;
        this.dateOfBirth = user.dateOfBirth;
        this.isVerified = user.isVerified;
        this.status = user.status;
        this.lastOnline = user.lastOnline;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    static from(user) {
        if (!user) return null;
        return new AuthUserResponseDto(user);
    }
}
