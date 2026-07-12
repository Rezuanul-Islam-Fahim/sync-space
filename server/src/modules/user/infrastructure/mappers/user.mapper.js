import { User } from '../../domain/user.entity.js';

const toRawObject = value => {
    if (!value) return null;

    return typeof value.toObject === 'function' ? value.toObject() : value;
};

export class UserMapper {
    static toDomain(raw) {
        if (!raw) return null;

        const document = toRawObject(raw);

        return new User({
            id: (document._id ?? document.id)?.toString(),
            email: document.email,
            username: document.username,
            displayName: document.displayName,
            avatar: document.avatar,
            bio: document.bio,
            banner: document.banner,
            bannerColor: document.bannerColor,
            dateOfBirth: document.dateOfBirth,
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
            displayName: domainUser.displayName,
            avatar: domainUser.avatar,
            bio: domainUser.bio,
            banner: domainUser.banner,
            bannerColor: domainUser.bannerColor,
            dateOfBirth: domainUser.dateOfBirth,
            status: domainUser.status,
            lastOnline: domainUser.lastOnline,
        };
    }
}
