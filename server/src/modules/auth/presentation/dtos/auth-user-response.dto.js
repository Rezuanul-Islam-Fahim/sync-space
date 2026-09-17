/**
 * Presentation DTO representing an authenticated user's public metadata.
 */
export class AuthUserResponseDto {
    /**
     * @param {import('../../domain/auth-user.entity.js').AuthUser | object} user
     */
    constructor(user) {
        this.id = user.id?.toString();
        this.email = user.email;
        this.isVerified = user.isVerified;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    /**
     * @param {import('../../domain/auth-user.entity.js').AuthUser | object} user
     * @returns {AuthUserResponseDto}
     */
    static from(user) {
        return new AuthUserResponseDto(user);
    }
}
