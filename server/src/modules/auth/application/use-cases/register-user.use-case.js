import { AppError, PasswordHasherPort } from '../../../../shared/index.js';
import {
    EMAIL_ALREADY_REGISTERED,
    USERNAME_ALREADY_TAKEN,
} from '../../domain/auth.constant.js';
import { AuthUserReaderPort } from '../ports/auth-user-reader.port.js';
import { AuthUserWriterPort } from '../ports/auth-user-writer.port.js';
import { User } from '../../../user/index.js';

export class RegisterUserUseCase {
    constructor({ authUserReader, authUserWriter, passwordHasher }) {
        if (!(authUserReader instanceof AuthUserReaderPort)) {
            throw new Error(
                'RegisterUserUseCase: authUserReader must implement AuthUserReaderPort'
            );
        }
        if (!(authUserWriter instanceof AuthUserWriterPort)) {
            throw new Error(
                'RegisterUserUseCase: authUserWriter must implement AuthUserWriterPort'
            );
        }
        if (!(passwordHasher instanceof PasswordHasherPort)) {
            throw new Error(
                'RegisterUserUseCase: passwordHasher must implement PasswordHasherPort'
            );
        }
        this.authUserReader = authUserReader;
        this.authUserWriter = authUserWriter;
        this.passwordHasher = passwordHasher;
    }

    async execute(data) {
        const existingUserByEmail =
            await this.authUserReader.findByEmailWithPassword(data.email);

        if (existingUserByEmail) {
            throw new AppError(EMAIL_ALREADY_REGISTERED, 'CONFLICT');
        }

        const existingUserByUsername = await this.authUserReader.findByUsername(
            data.username
        );

        if (existingUserByUsername) {
            throw new AppError(USERNAME_ALREADY_TAKEN, 'CONFLICT');
        }

        const hashedPassword = await this.passwordHasher.hash(data.password);

        const userEntity = new User({
            email: data.email,
            username: data.username,
            password: hashedPassword,
            displayName: data.displayName,
            dateOfBirth: data.dateOfBirth,
        });

        try {
            const newUser = await this.authUserWriter.createUser(userEntity);
            return newUser;
        } catch (error) {
            if (error.code === 11000 && error.keyValue) {
                const key = Object.keys(error.keyValue)[0];
                if (key === 'email') {
                    throw new AppError(EMAIL_ALREADY_REGISTERED, 'CONFLICT');
                }
                if (key === 'username') {
                    throw new AppError(USERNAME_ALREADY_TAKEN, 'CONFLICT');
                }
            }
            throw error;
        }
    }
}
