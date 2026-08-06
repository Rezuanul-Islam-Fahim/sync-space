import { UnauthorizedError } from '../../../../shared/error/index.js';
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
            throw new UnauthorizedError(INVALID_CREDENTIALS);
        }

        const isPasswordMatch = await this.passwordHasher.compare(
            data.password,
            user.password
        );

        if (!isPasswordMatch) {
            throw new UnauthorizedError(INVALID_CREDENTIALS);
        }

        const tokens = await this.tokenGenerator.generateTokens(
            user.id,
            user.email
        );

        this.logger?.info?.('User login successful', {
            authUserId: user.id,
            email: user.email,
        });

        return {
            user,
            tokens,
        };
    }
}
