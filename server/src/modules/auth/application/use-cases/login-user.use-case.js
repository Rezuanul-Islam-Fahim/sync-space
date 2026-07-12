import { AppError, ErrorCode } from '../../../../shared/index.js';
import { INVALID_CREDENTIALS } from '../../domain/auth.constant.js';

export class LoginUserUseCase {
    constructor({ authUserReader, passwordHasher, tokenGenerator, logger }) {
        this.authUserReader = authUserReader;
        this.passwordHasher = passwordHasher;
        this.tokenGenerator = tokenGenerator;
        this.logger = logger;
    }

    async execute(data) {
        const user = await this.authUserReader.findByEmail(data.email);

        if (!user) {
            throw new AppError(INVALID_CREDENTIALS, ErrorCode.UNAUTHENTICATED);
        }

        const isPasswordMatch = await user.verifyPassword(
            data.password,
            this.passwordHasher
        );

        if (!isPasswordMatch) {
            throw new AppError(INVALID_CREDENTIALS, ErrorCode.UNAUTHENTICATED);
        }

        const tokens = this.tokenGenerator.generateTokens(user.id, user.email);

        return {
            user,
            tokens,
        };
    }
}
