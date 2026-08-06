/**
 * Application Data Transfer Object representing an Auth User across bounded context boundaries.
 * Shields internal domain entity representation (e.g., password hash) from external consumers.
 */
export class AuthUserDto {
    constructor({ id, email, isVerified, createdAt, updatedAt }) {
        this.id = id;
        this.email = email;
        this.isVerified = isVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        Object.freeze(this);
    }

    /**
     * Maps an AuthUser domain entity to an AuthUserDto.
     *
     * @param {import('../../domain/auth-user.entity.js').AuthUser} entity
     * @returns {AuthUserDto | null}
     */
    static fromEntity(entity) {
        if (!entity) return null;
        return new AuthUserDto({
            id: entity.id,
            email: entity.email,
            isVerified: entity.isVerified,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}
