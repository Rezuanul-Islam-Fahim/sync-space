/**
 * Application Data Transfer Object representing a User Profile across bounded context boundaries.
 * Decouples internal User domain entity from external consumers.
 */
export class UserProfileDto {
    constructor({
        id,
        authId,
        username,
        displayName,
        avatar,
        bio,
        banner,
        bannerColor,
        dateOfBirth,
        status,
        lastOnline,
        createdAt,
        updatedAt,
    }) {
        this.id = id;
        this.authId = authId;
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

    /**
     * Maps a User domain entity to a UserProfileDto.
     *
     * @param {import('../../domain/user.entity.js').User} entity
     * @returns {UserProfileDto | null}
     */
    static fromEntity(entity) {
        if (!entity) return null;
        return new UserProfileDto({
            id: entity.id,
            authId: entity.authId,
            username: entity.username,
            displayName: entity.displayName,
            avatar: entity.avatar,
            bio: entity.bio,
            banner: entity.banner,
            bannerColor: entity.bannerColor,
            dateOfBirth: entity.dateOfBirth,
            status: entity.status,
            lastOnline: entity.lastOnline,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}
