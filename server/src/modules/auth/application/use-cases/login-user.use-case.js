import { AppError, ErrorCode } from '../../../../shared/error/index.js';
import { INVALID_CREDENTIALS } from '../../domain/auth-user.constant.js';

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

        const isPasswordMatch = await this.passwordHasher.compare(
            data.password,
            user.password
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
