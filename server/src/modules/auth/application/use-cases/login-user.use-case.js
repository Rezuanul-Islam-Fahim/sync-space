import {
    AppError,
    ErrorCode,
    TokenGeneratorPort,
    PasswordHasherPort,
} from '../../../../shared/index.js';
import { INVALID_CREDENTIALS } from '../../domain/auth.constant.js';
import { AuthUserReaderPort } from '../ports/auth-user-reader.port.js';

export class LoginUserUseCase {
    constructor({ authUserReader, tokenGenerator, passwordHasher }) {
        if (!(authUserReader instanceof AuthUserReaderPort)) {
            throw new Error(
                'LoginUserUseCase: authUserReader must implement AuthUserReaderPort'
            );
        }
        if (!(tokenGenerator instanceof TokenGeneratorPort)) {
            throw new Error(
                'LoginUserUseCase: tokenGenerator must implement TokenGeneratorPort'
            );
        }
        if (!(passwordHasher instanceof PasswordHasherPort)) {
            throw new Error(
                'LoginUserUseCase: passwordHasher must implement PasswordHasherPort'
            );
        }
        this.authUserReader = authUserReader;
        this.tokenGenerator = tokenGenerator;
        this.passwordHasher = passwordHasher;
    }

    async execute(data) {
        const user = await this.authUserReader.findByEmailWithPassword(
            data.email
        );

        if (!user) {
            throw new AppError(INVALID_CREDENTIALS, ErrorCode.UNAUTHORIZED);
        }

        const isPasswordMatch = await this.passwordHasher.compare(
            data.password,
            user.password
        );

        if (!isPasswordMatch) {
            throw new AppError(INVALID_CREDENTIALS, ErrorCode.UNAUTHORIZED);
        }

        const tokens = this.tokenGenerator.generateTokens(user.id, user.email);

        return {
            user: user.excludePassword(),
            tokens,
        };
    }
}
