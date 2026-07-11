import { AppError, ErrorCode } from '../../../../shared/index.js';
import {
    EMAIL_ALREADY_REGISTERED,
    USERNAME_ALREADY_TAKEN,
} from '../../domain/user.constant.js';

import { User } from '../../domain/user.entity.js';

export class CreateUserUseCase {
    constructor({ userReader, userWriter, logger }) {
        this.userReader = userReader;
        this.userWriter = userWriter;
        this.logger = logger;
    }

    async execute(data) {
        const existingUserByEmail = await this.userReader.findByEmail(
            data.email
        );

        if (existingUserByEmail) {
            throw new AppError(EMAIL_ALREADY_REGISTERED, ErrorCode.ALREADY_EXISTS);
        }

        const existingUserByUsername = await this.userReader.findByUsername(
            data.username
        );

        if (existingUserByUsername) {
            throw new AppError(USERNAME_ALREADY_TAKEN, ErrorCode.ALREADY_EXISTS);
        }

        const newUserEntity = new User({
            email: data.email,
            username: data.username,
            password: data.password,
            displayName: data.displayName,
            dateOfBirth: data.dateOfBirth,
        });

        const newUser = await this.userWriter.createUser(newUserEntity);

        return newUser;
    }
}
