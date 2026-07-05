import AppError from '../../../common/errors/app.error.js';
import {
    EMAIL_ALREADY_REGISTERED,
    USERNAME_ALREADY_TAKEN,
} from '../../../constants/app-messages.constant.js';
import { CONFLICT } from '../../../constants/http-status.constant.js';

export class RegisterUserUseCase {
    constructor({ userRepository, passwordHasher, saltRounds }) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.saltRounds = saltRounds;
    }

    execute = async data => {
        const existingUserByEmail = await this.userRepository.findByEmail(
            data.email
        );

        if (existingUserByEmail) {
            throw new AppError(EMAIL_ALREADY_REGISTERED, CONFLICT);
        }

        const existingUserByUsername = await this.userRepository.findByUsername(
            data.username
        );

        if (existingUserByUsername) {
            throw new AppError(USERNAME_ALREADY_TAKEN, CONFLICT);
        }

        const hashedPassword = await this.passwordHasher.hash(
            data.password,
            this.saltRounds
        );

        const newUser = await this.userRepository.createUser({
            ...data,
            password: hashedPassword,
        });

        return newUser;
    };
}
