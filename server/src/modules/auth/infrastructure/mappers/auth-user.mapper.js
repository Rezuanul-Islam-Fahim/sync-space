import { AuthUser } from '../../domain/auth-user.entity.js';
import { toRawObject } from '../../../../shared/infrastructure/index.js';
import { AppError, ErrorCode } from '../../../../shared/error/index.js';

export class AuthUserMapper {
    /**
     * Maps a raw database document or plain object to an AuthUser domain entity.
     *
     * @param {any} raw
     * @returns {AuthUser | null}
     */
    static toDomain(raw) {
        if (!raw) return null;

        const document = toRawObject(raw);
        const id = (document._id ?? document.id)?.toString();

        if (!id || !document.email || !document.password) {
            throw new AppError(
                'Incomplete database record: AuthUser mapping failed due to missing required fields',
                ErrorCode.INTERNAL_ERROR
            );
        }

        return new AuthUser({
            id,
            email: document.email,
            password: document.password,
            isVerified: document.isVerified ?? false,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        });
    }

    /**
     * Maps an AuthUser domain entity to persistence document object.
     *
     * @param {AuthUser} domainUser
     * @returns {object | null}
     */
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
