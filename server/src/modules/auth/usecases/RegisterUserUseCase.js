import bcrypt from 'bcrypt';
import AppError from '../../../common/app-error.js';
import config from '../../../config/index.js';
import {
    EMAIL_ALREADY_REGISTERED,
    USERNAME_ALREADY_TAKEN,
} from '../../../constants/app-messages.js';
import { CONFLICT } from '../../../constants/http-status.js';

export class RegisterUserUseCase {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    async execute(data) {
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

        const hashedPassword = await bcrypt.hash(
            data.password,
            config.auth.saltRounds
        );

        const newUser = await this.userRepository.createUser({
            ...data,
            password: hashedPassword,
        });

        return newUser;
    }
}
