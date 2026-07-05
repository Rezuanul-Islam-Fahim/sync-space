import { AppError, TokenServicePort } from '../../../../shared/index.js';
import {
    INVALID_CREDENTIALS,
    UNAUTHORIZED,
} from '../../../../constants/index.js';
import { ValidateCredentialsUseCase } from '../../../user/index.js';

export class LoginUserUseCase {
    constructor({ validateCredentialsUseCase, tokenService }) {
        if (
            !(validateCredentialsUseCase instanceof ValidateCredentialsUseCase)
        ) {
            throw new Error(
                'LoginUserUseCase: validateCredentialsUseCase must implement ValidateCredentialsUseCase'
            );
        }
        if (!(tokenService instanceof TokenServicePort)) {
            throw new Error(
                'LoginUserUseCase: tokenService must implement TokenServicePort'
            );
        }
        this.validateCredentialsUseCase = validateCredentialsUseCase;
        this.tokenService = tokenService;
    }

    execute = async data => {
        const user = await this.validateCredentialsUseCase.execute({
            email: data.email,
            password: data.password,
        });

        if (!user) {
            throw new AppError(INVALID_CREDENTIALS, UNAUTHORIZED);
        }

        const tokens = this.tokenService.generateTokens(user.id, user.email);

        return { user, tokens };
    };
}
