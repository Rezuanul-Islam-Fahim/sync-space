/**
 * Presentation DTO for registration endpoint response payload.
 */
export class RegistrationResponseDto {
    /**
     * @param {{
     *   authUser: import('../../../../modules/auth/application/dtos/auth-user.dto.js').AuthUserDto | object,
     *   userProfile: import('../../../../modules/user/application/dtos/user-profile.dto.js').UserProfileDto | object
     * }} params
     */
    constructor({ authUser, userProfile }) {
        this.id = userProfile?.id?.toString() ?? authUser?.id?.toString();
        this.authId = authUser?.id?.toString();
        this.email = authUser?.email;
        this.isVerified = authUser?.isVerified ?? false;
        this.username = userProfile?.username;
        this.displayName = userProfile?.displayName ?? null;
        this.avatar = userProfile?.avatar ?? null;
        this.bio = userProfile?.bio ?? null;
        this.dateOfBirth = userProfile?.dateOfBirth;
        this.createdAt = userProfile?.createdAt ?? authUser?.createdAt;
        this.updatedAt = userProfile?.updatedAt ?? authUser?.updatedAt;
    }

    /**
     * @param {{
     *   authUser: import('../../../../modules/auth/application/dtos/auth-user.dto.js').AuthUserDto | object,
     *   userProfile: import('../../../../modules/user/application/dtos/user-profile.dto.js').UserProfileDto | object
     * }} params
     * @returns {RegistrationResponseDto}
     */
    static from({ authUser, userProfile }) {
        return new RegistrationResponseDto({ authUser, userProfile });
    }
}
