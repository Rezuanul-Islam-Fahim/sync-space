import { AuthUser } from '../../domain/auth-user.entity.js';
import { toRawObject } from '../../../../shared/util/mongoose-to-raw.util.js';

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

        // Maps only the fields stored in the `credentials` collection.
        return {
            email: domainUser.email,
            password: domainUser.password,
            isVerified: domainUser.isVerified,
        };
    }
}
