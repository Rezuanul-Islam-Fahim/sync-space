export class RegisterRequestDto {
    constructor(data) {
        this.email = data.email
        this.username = data.username
        this.password = data.password
        this.displayName = data.displayName
        this.agreeToTerms = data.agreeToTerms ?? false
        this.avatar = data.avatar
        this.bio = data.bio
        this.banner = data.banner
        this.bannerColor = data.bannerColor ?? '5865F2'
        this.dateOfBirth = data.dateOfBirth
        this.isVerified = data.isVerified
        this.status = data.status
        this.lastOnline = data.lastOnline
    }

    static from(body) {
        return new RegisterRequestDto(body)
    }
}

export class RegisterResponseDto {
    constructor(user) {
        this.id = user._id.toString()
        this.email = user.email
        this.username = user.username
        this.displayName = user.displayName
        this.password = user.password
        this.agreeToTerms = user.agreeToTerms
        this.avatar = user.avatar
        this.bio = user.bio
        this.banner = user.banner
        this.bannerColor = user.bannerColor
        this.dateOfBirth = user.dateOfBirth
        this.isVerified = user.isVerified
        this.status = user.status
        this.lastOnline = user.lastOnline
        this.createdAt = user.createdAt
        this.updatedAt = user.updatedAt
    }

    static from(user) {
        return new RegisterResponseDto(user)
    }
}
