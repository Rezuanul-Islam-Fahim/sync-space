import { AppError, TokenServicePort } from '../../../../shared/index.js';
import {
    INVALID_CREDENTIALS,
    UNAUTHORIZED,
} from '../../../../shared/constants/index.js';
import { AuthUserProviderPort } from '../ports/auth-user-provider.port.js';

export class LoginUserUseCase {
    constructor({ authUserProvider, tokenService }) {
        if (!(authUserProvider instanceof AuthUserProviderPort)) {
            throw new Error(
                'LoginUserUseCase: authUserProvider must implement AuthUserProviderPort'
            );
        }
        if (!(tokenService instanceof TokenServicePort)) {
            throw new Error(
                'LoginUserUseCase: tokenService must implement TokenServicePort'
            );
        }
        this.authUserProvider = authUserProvider;
        this.tokenService = tokenService;
    }

    execute = async data => {
        const user = await this.authUserProvider.validateCredentials(
            data.email,
            data.password
        );

        if (!user) {
            throw new AppError(INVALID_CREDENTIALS, UNAUTHORIZED);
        }

        const tokens = this.tokenService.generateTokens(user.id, user.email);

        return { user, tokens };
    };
}
