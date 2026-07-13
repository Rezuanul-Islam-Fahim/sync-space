import { AuthUser } from '../../domain/auth-user.entity.js';
import { toRawObject } from '../../../../shared/util/mongoose-to-raw.util.js';

export class AuthUserMapper {
    static toDomain(raw) {
        if (!raw) return null;

        const document = toRawObject(raw);

        return new AuthUser({
            id: (document._id ?? document.id)?.toString(),
            email: document.email,
            username: document.username,
            password: document.password,
            displayName: document.displayName,
            dateOfBirth: document.dateOfBirth,
            isVerified: document.isVerified,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        });
    }

    static toPersistence(domainUser) {
        if (!domainUser) return null;

        // Maps only the fields owned by the auth module at creation time.
        // Profile-only fields (avatar, bio, banner, status, lastOnline) are
        // written as Mongoose schema defaults and managed by the user module.
        return {
            email: domainUser.email,
            username: domainUser.username,
            password: domainUser.password,
            isVerified: domainUser.isVerified,
            displayName: domainUser.displayName ?? null,
            dateOfBirth: domainUser.dateOfBirth,
        };
    }
}
