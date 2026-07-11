import { AppError, ErrorCode } from '../../../../shared/index.js';
import {
    EMAIL_ALREADY_REGISTERED,
    USERNAME_ALREADY_TAKEN,
} from '../../domain/user.constant.js';

export class CreateUserUseCase {
    constructor({ userReader, userWriter }) {
        if (
            typeof userReader?.findByEmailWithPassword !== 'function' ||
            typeof userReader?.findByUsername !== 'function'
        ) {
            throw new Error(
                'CreateUserUseCase: userReader must implement findByEmailWithPassword and findByUsername methods'
            );
        }
        if (typeof userWriter?.createUser !== 'function') {
            throw new Error(
                'CreateUserUseCase: userWriter must implement createUser method'
            );
        }
        this.userReader = userReader;
        this.userWriter = userWriter;
    }

    async execute(data) {
        const existingUserByEmail =
            await this.userReader.findByEmailWithPassword(data.email);

        if (existingUserByEmail) {
            throw new AppError(EMAIL_ALREADY_REGISTERED, ErrorCode.CONFLICT);
        }

        const existingUserByUsername = await this.userReader.findByUsername(
            data.username
        );

        if (existingUserByUsername) {
            throw new AppError(USERNAME_ALREADY_TAKEN, ErrorCode.CONFLICT);
        }

        const newUser = await this.userWriter.createUser({
            email: data.email,
            username: data.username,
            password: data.password,
            displayName: data.displayName,
            dateOfBirth: data.dateOfBirth,
        });

        return newUser;
    }
}
