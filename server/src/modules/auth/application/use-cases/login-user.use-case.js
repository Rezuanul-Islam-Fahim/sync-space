import { AppError, ErrorCode } from '../../../../shared/index.js';
import { INVALID_CREDENTIALS } from '../../domain/auth.constant.js';

export class LoginUserUseCase {
    constructor({ validateCredentials, tokenGenerator, logger }) {
        if (typeof validateCredentials?.execute !== 'function') {
            throw new Error(
                'LoginUserUseCase: validateCredentials must implement execute method'
            );
        }
        if (typeof tokenGenerator?.generateTokens !== 'function') {
            throw new Error(
                'LoginUserUseCase: tokenGenerator must implement generateTokens method'
            );
        }
        this.validateCredentials = validateCredentials;
        this.tokenGenerator = tokenGenerator;
        this.logger = logger;
    }

    async execute(data) {
        const user = await this.validateCredentials.execute(data);

        if (!user) {
            throw new AppError(INVALID_CREDENTIALS, ErrorCode.UNAUTHENTICATED);
        }

        const tokens = this.tokenGenerator.generateTokens(user.id, user.email);

        return {
            user,
            tokens,
        };
    }
}
