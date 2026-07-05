import AppError from '../../../../shared/errors/app.error.js';
import {
    EMAIL_ALREADY_REGISTERED,
    USERNAME_ALREADY_TAKEN,
} from '../../../../constants/app-messages.constant.js';
import { CONFLICT } from '../../../../constants/http-status.constant.js';
import { UserServicePort } from '../../../user/index.js';
import { PasswordHasherPort } from '../../../../shared/ports/password-hasher.port.js';

export class RegisterUserUseCase {
    constructor({ userService, passwordHasher, saltRounds }) {
        if (!(userService instanceof UserServicePort)) {
            throw new Error(
                'RegisterUserUseCase: userService must implement UserServicePort'
            );
        }
        if (!(passwordHasher instanceof PasswordHasherPort)) {
            throw new Error(
                'RegisterUserUseCase: passwordHasher must implement PasswordHasherPort'
            );
        }
        this.userService = userService;
        this.passwordHasher = passwordHasher;
        this.saltRounds = saltRounds;
    }

    execute = async data => {
        const existingUserByEmail = await this.userService.findByEmail(
            data.email
        );

        if (existingUserByEmail) {
            throw new AppError(EMAIL_ALREADY_REGISTERED, CONFLICT);
        }

        const existingUserByUsername = await this.userService.findByUsername(
            data.username
        );

        if (existingUserByUsername) {
            throw new AppError(USERNAME_ALREADY_TAKEN, CONFLICT);
        }

        const hashedPassword = await this.passwordHasher.hash(
            data.password,
            this.saltRounds
        );

        const newUser = await this.userService.createUser({
            ...data,
            password: hashedPassword,
        });

        return newUser;
    };
}
