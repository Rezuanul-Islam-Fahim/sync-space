export class UserSnapshotDto {
    constructor(user) {
        this.id = user.id?.toString();
        this.username = user.username;
        this.displayName = user.displayName;
        this.avatar = user.avatar;
        this.status = user.status;
        this.lastOnline = user.lastOnline;
    }

    static from(user) {
        return new UserSnapshotDto(user);
    }
}

export class UserDto extends UserSnapshotDto {
    constructor(user) {
        super(user);
        this.email = user.email;
        this.bio = user.bio;
        this.banner = user.banner;
        this.bannerColor = user.bannerColor;
        this.dateOfBirth = user.dateOfBirth;
        this.isVerified = user.isVerified;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    static from(user) {
        return new UserDto(user);
    }
}

export class UserAuthDto {
    constructor(user) {
        this.id = user.id?.toString();
        this.email = user.email;
        this.username = user.username;
        this.password = user.password;
        this.isVerified = user.isVerified;
    }

    static from(user) {
        return new UserAuthDto(user);
    }
}
