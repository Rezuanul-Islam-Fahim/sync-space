import { User } from '../../domain/user.entity.js';

const toRawObject = value => {
    if (!value) return null;

    return typeof value.toObject === 'function'
        ? value.toObject({ transform: false })
        : value;
};

export class UserMapper {
    static toDomain(raw) {
        if (!raw) return null;

        const document = toRawObject(raw);

        return new User({
            id: (document._id ?? document.id)?.toString(),
            email: document.email,
            username: document.username,
            password: document.password,
            displayName: document.displayName,
            avatar: document.avatar,
            bio: document.bio,
            banner: document.banner,
            bannerColor: document.bannerColor,
            dateOfBirth: document.dateOfBirth,
            isVerified: document.isVerified,
            status: document.status,
            lastOnline: document.lastOnline,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        });
    }

    static toPersistence(domainUser) {
        if (!domainUser) return null;

        return {
            email: domainUser.email,
            username: domainUser.username,
            password: domainUser.password,
            displayName: domainUser.displayName,
            avatar: domainUser.avatar,
            bio: domainUser.bio,
            banner: domainUser.banner,
            bannerColor: domainUser.bannerColor,
            dateOfBirth: domainUser.dateOfBirth,
            isVerified: domainUser.isVerified,
            status: domainUser.status,
            lastOnline: domainUser.lastOnline,
        };
    }
}
