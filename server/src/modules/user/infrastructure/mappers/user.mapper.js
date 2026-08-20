import { User } from '../../domain/user.entity.js';
import { toRawObject } from '../../../../shared/infrastructure/index.js';
import { AppError, ErrorCode } from '../../../../shared/error/index.js';

export class UserMapper {
    /**
     * Maps a raw database document or plain object to a User domain entity.
     *
     * @param {any} raw
     * @returns {User | null}
     */
    static toDomain(raw) {
        if (!raw) return null;

        const document = toRawObject(raw);
        const id = (document._id ?? document.id)?.toString();
        const authId = document.authId?.toString();

        if (!id || !authId || !document.username || !document.dateOfBirth) {
            throw new AppError(
                'Incomplete database record: User mapping failed due to missing required fields',
                ErrorCode.INTERNAL_ERROR
            );
        }

        return new User({
            id,
            authId,
            username: document.username,
            displayName: document.displayName ?? null,
            avatar: document.avatar ?? null,
            bio: document.bio ?? null,
            banner: document.banner ?? null,
            bannerColor: document.bannerColor,
            dateOfBirth: document.dateOfBirth,
            status: document.status,
            lastOnline: document.lastOnline ?? null,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        });
    }

    /**
     * Maps a User domain entity to persistence document object.
     *
     * @param {User} domainUser
     * @returns {object | null}
     */
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
