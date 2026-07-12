export class RegisterResponseDto {
    constructor(user) {
        this.id = user.id?.toString();
        this.email = user.email;
        this.username = user.username;
    }

    static from(user) {
        return new RegisterResponseDto(user);
    }
}
