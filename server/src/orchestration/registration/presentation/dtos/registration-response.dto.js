export class RegistrationResponseDto {
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

    static from({ authUser, userProfile }) {
        return new RegistrationResponseDto({ authUser, userProfile });
    }
}
