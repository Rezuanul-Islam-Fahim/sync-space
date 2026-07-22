export class RegistrationResponseDto {
    constructor(user) {
        this.id = user.id?.toString();
        this.email = user.email;
        this.isVerified = user.isVerified;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    static from(user) {
        return new RegistrationResponseDto(user);
    }
}
