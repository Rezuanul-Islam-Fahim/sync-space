import { AuthUser } from '../../domain/auth-user.entity.js';
import { toRawObject } from '../../../../shared/infrastructure/index.js';

export class AuthUserMapper {
    static toDomain(raw) {
        if (!raw) return null;

        const document = toRawObject(raw);

        return new AuthUser({
            id: (document._id ?? document.id)?.toString(),
            email: document.email,
            password: document.password,
            isVerified: document.isVerified,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        });
    }

    static toPersistence(domainUser) {
        if (!domainUser) return null;

        // Maps fields stored in the `credentials` collection.
        const persistenceData = {
            email: domainUser.email,
            password: domainUser.password,
            isVerified: domainUser.isVerified,
        };

        if (domainUser.id) {
            persistenceData._id = domainUser.id;
        }

        return persistenceData;
    }
}
