import { User } from '../../domain/user.entity.js';
import { toRawObject } from '../../../../shared/infrastructure/index.js';

export class UserMapper {
    static toDomain(raw) {
        if (!raw) return null;

        const document = toRawObject(raw);

        return new User({
            id: (document._id ?? document.id)?.toString(),
            authId: document.authId?.toString(),
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

        const persistenceData = {
            authId: domainUser.authId,
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

        if (domainUser.id) {
            persistenceData._id = domainUser.id;
        }

        return persistenceData;
    }
}
