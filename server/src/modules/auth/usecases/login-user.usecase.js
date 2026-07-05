import AppError from '../../../common/app-error.js';
import { INVALID_CREDENTIALS } from '../../../constants/app-messages.js';
import { UNAUTHORIZED } from '../../../constants/http-status.js';

export class LoginUserUseCase {
    constructor({ userRepository, passwordHasher, tokenService }) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenService = tokenService;
    }

    execute = async data => {
        const user = await this.userRepository.findAuthByEmail(data.email);

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
