import { UserStatus, BANNER_DEFAULT_COLOR } from './user.constant.js';

export class User {
    constructor({
        id,
        email,
        username,
        displayName = null,
        avatar = null,
        bio = null,
        banner = null,
        bannerColor = BANNER_DEFAULT_COLOR,
        dateOfBirth,
        status = UserStatus.OFFLINE,
        lastOnline = null,
        createdAt,
        updatedAt,
    }) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.displayName = displayName;
        this.avatar = avatar;
        this.bio = bio;
        this.banner = banner;
        this.bannerColor = bannerColor;
        this.dateOfBirth = dateOfBirth;
        this.status = status;
        this.lastOnline = lastOnline;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        Object.freeze(this);
    }
}
