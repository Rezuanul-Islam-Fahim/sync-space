import { AppError, ErrorCode } from '../../../../shared/index.js';
import { AuthUser } from '../../domain/auth-user.entity.js';
import { INVALID_CREDENTIALS } from '../../domain/auth.constant.js';

export class LoginUserUseCase {
    constructor({ authUserReader, passwordHasher, tokenGenerator, logger }) {
        this.authUserReader = authUserReader;
        this.passwordHasher = passwordHasher;
        this.tokenGenerator = tokenGenerator;
        this.logger = logger;
    }

    async execute(data) {
        const user = await this.authUserReader.findByEmailWithPassword(
            data.email
        );

        if (!user) {
            throw new AppError(INVALID_CREDENTIALS, ErrorCode.UNAUTHENTICATED);
        }

        const isPasswordMatch = await this.passwordHasher.compare(
            data.password,
            user.password
        );

        if (!isPasswordMatch) {
            throw new AppError(INVALID_CREDENTIALS, ErrorCode.UNAUTHENTICATED);
        }

        const tokens = this.tokenGenerator.generateTokens(user.id, user.email);

        const safeUser = new AuthUser({
            id: user.id,
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
            displayName: user.displayName,
            dateOfBirth: user.dateOfBirth,
            avatar: user.avatar,
            bio: user.bio,
            banner: user.banner,
            bannerColor: user.bannerColor,
            status: user.status,
            lastOnline: user.lastOnline,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });

        return {
            user: safeUser,
            tokens,
        };
    }
}
