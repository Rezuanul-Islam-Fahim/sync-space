import AppError from '../../../../shared/errors/app.error.js';
import { INVALID_CREDENTIALS } from '../../../../constants/app-messages.constant.js';
import { UNAUTHORIZED } from '../../../../constants/http-status.constant.js';
import { UserRepositoryPort } from '../../../user/index.js';
import { PasswordHasherPort } from '../../../../shared/ports/password-hasher.port.js';
import { TokenServicePort } from '../../../../shared/ports/token-service.port.js';

export class LoginUserUseCase {
    constructor({ userRepository, passwordHasher, tokenService }) {
        if (!(userRepository instanceof UserRepositoryPort)) {
            throw new Error(
                'LoginUserUseCase: userRepository must implement UserRepositoryPort'
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
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenService = tokenService;
    }

    execute = async data => {
        const user = await this.userRepository.findByEmailWithPassword(
            data.email
        );

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

        const { password: _password, ...safeUser } = user;

        return { user: safeUser, tokens };
    };
}
