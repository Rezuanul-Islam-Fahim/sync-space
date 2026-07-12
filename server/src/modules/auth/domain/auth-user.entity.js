import {
    UserStatus,
    BANNER_DEFAULT_COLOR,
} from '../../../shared/constant/index.js';

export class AuthUser {
    constructor({
        id,
        email,
        username,
        password,
        isVerified = false,
        displayName = null,
        dateOfBirth = null,
        avatar = null,
        bio = null,
        banner = null,
        bannerColor = BANNER_DEFAULT_COLOR,
        status = UserStatus.OFFLINE,
        lastOnline = null,
        createdAt = null,
        updatedAt = null,
    } = {}) {
        this.id = id;
        this.email = email;
        this.username = username;
        if (password !== undefined) {
            this.password = password;
        }
        this.isVerified = isVerified;
        this.displayName = displayName;
        this.dateOfBirth = dateOfBirth;
        this.avatar = avatar;
        this.bio = bio;
        this.banner = banner;
        this.bannerColor = bannerColor;
        this.status = status;
        this.lastOnline = lastOnline;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        Object.freeze(this);
    }
}
