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
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        });
    }

    static toPersistence(domainUser, additionalProfileData = {}) {
        if (!domainUser) return null;

        return {
            email: domainUser.email,
            username: domainUser.username,
            password: domainUser.password,
            isVerified: domainUser.isVerified,
            ...additionalProfileData,
        };
    }
}
