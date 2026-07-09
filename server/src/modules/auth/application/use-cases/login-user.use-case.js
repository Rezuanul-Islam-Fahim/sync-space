import {
    AppError,
    ErrorCode,
    TokenGeneratorPort,
} from '../../../../shared/index.js';
import { INVALID_CREDENTIALS } from '../../domain/auth.constant.js';
import { ValidateCredentialsPort } from '../ports/validate-credentials.port.js';

export class LoginUserUseCase {
    constructor({ validateCredentials, tokenGenerator }) {
        if (!(validateCredentials instanceof ValidateCredentialsPort)) {
            throw new Error(
                'LoginUserUseCase: validateCredentials must implement ValidateCredentialsPort'
            );
        }
        if (!(tokenGenerator instanceof TokenGeneratorPort)) {
            throw new Error(
                'LoginUserUseCase: tokenGenerator must implement TokenGeneratorPort'
            );
        }
        this.validateCredentials = validateCredentials;
        this.tokenGenerator = tokenGenerator;
    }

    async execute(data) {
        const user = await this.validateCredentials.execute(data);

        if (!user) {
            throw new AppError(INVALID_CREDENTIALS, ErrorCode.UNAUTHORIZED);
        }

        const tokens = this.tokenGenerator.generateTokens(user.id, user.email);

        return {
            user,
            tokens,
        };
    }
}
