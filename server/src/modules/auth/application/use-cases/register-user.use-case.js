import { AppError, PasswordHasherPort } from '../../../../shared/index.js';
import {
    EMAIL_ALREADY_REGISTERED,
    USERNAME_ALREADY_TAKEN,
} from '../../../../shared/constants/index.js';
import { AuthUserProviderPort } from '../ports/auth-user-provider.port.js';
import { User } from '../../../user/index.js';

export class RegisterUserUseCase {
    constructor({ authUserProvider, passwordHasher, saltRounds }) {
        if (!(authUserProvider instanceof AuthUserProviderPort)) {
            throw new Error(
                'RegisterUserUseCase: authUserProvider must implement AuthUserProviderPort'
            );
        }
        if (!(passwordHasher instanceof PasswordHasherPort)) {
            throw new Error(
                'RegisterUserUseCase: passwordHasher must implement PasswordHasherPort'
            );
        }
        this.authUserProvider = authUserProvider;
        this.passwordHasher = passwordHasher;
        this.saltRounds = saltRounds;
    }

    execute = async data => {
        const existingUserByEmail = await this.authUserProvider.findByEmail(
            data.email
        );

        if (existingUserByEmail) {
            throw new AppError(EMAIL_ALREADY_REGISTERED, 'CONFLICT');
        }

        const existingUserByUsername =
            await this.authUserProvider.findByUsername(data.username);

        if (existingUserByUsername) {
            throw new AppError(USERNAME_ALREADY_TAKEN, 'CONFLICT');
        }

        const hashedPassword = await this.passwordHasher.hash(
            data.password,
            this.saltRounds
        );

        const userEntity = new User({
            email: data.email,
            username: data.username,
            password: hashedPassword,
            displayName: data.displayName,
            dateOfBirth: data.dateOfBirth,
        });

        const newUser = await this.authUserProvider.createUser(userEntity);

        return newUser;
    };
}
