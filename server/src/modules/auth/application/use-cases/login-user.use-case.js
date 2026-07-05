import {
    AppError,
    PasswordHasherPort,
    TokenServicePort,
} from '../../../../shared/index.js';
import {
    INVALID_CREDENTIALS,
    UNAUTHORIZED,
} from '../../../../constants/index.js';
import { UserServicePort } from '../../../user/index.js';

export class LoginUserUseCase {
    constructor({ userService, passwordHasher, tokenService }) {
        if (!(userService instanceof UserServicePort)) {
            throw new Error(
                'LoginUserUseCase: userService must implement UserServicePort'
            );
        }
        if (!(passwordHasher instanceof PasswordHasherPort)) {
            throw new Error(
                'LoginUserUseCase: passwordHasher must implement PasswordHasherPort'
            );
        }
        if (!(tokenService instanceof TokenServicePort)) {
            throw new Error(
                'LoginUserUseCase: tokenService must implement TokenServicePort'
            );
        }
        this.userService = userService;
        this.passwordHasher = passwordHasher;
        this.tokenService = tokenService;
    }

    execute = async data => {
        const user = await this.userService.findByEmailWithPassword(data.email);

        if (!user) {
            throw new AppError(INVALID_CREDENTIALS, UNAUTHORIZED);
        }

        const isMatch = await this.passwordHasher.compare(
            data.password,
            user.password
        );

        if (!isMatch) {
            throw new AppError(INVALID_CREDENTIALS, UNAUTHORIZED);
        }

        const tokens = this.tokenService.generateTokens(user.id, user.email);

        return { user, tokens };
    };
}
