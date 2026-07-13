export class AuthUserResponseDto {
    constructor(user) {
        this.id = user.id?.toString();
        this.email = user.email;
        this.username = user.username;
        this.isVerified = user.isVerified;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    static from(user) {
        return new AuthUserResponseDto(user);
    }
}
