import { AuthUser } from '../../domain/auth-user.entity.js';

const toRawObject = value => {
    if (!value) return null;

    return typeof value.toObject === 'function' ? value.toObject() : value;
};

export class AuthUserMapper {
    static toDomain(raw) {
        if (!raw) return null;

        const document = toRawObject(raw);

        return new AuthUser({
            id: (document._id ?? document.id)?.toString(),
            email: document.email,
            username: document.username,
            password: document.password,
            isVerified: document.isVerified,
            displayName: document.displayName,
            dateOfBirth: document.dateOfBirth,
            avatar: document.avatar,
            bio: document.bio,
            banner: document.banner,
            bannerColor: document.bannerColor,
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
            isVerified: domainUser.isVerified,
            displayName: domainUser.displayName,
            dateOfBirth: domainUser.dateOfBirth,
            avatar: domainUser.avatar,
            bio: domainUser.bio,
            banner: domainUser.banner,
            bannerColor: domainUser.bannerColor,
            status: domainUser.status,
            lastOnline: domainUser.lastOnline,
        };
    }
}
