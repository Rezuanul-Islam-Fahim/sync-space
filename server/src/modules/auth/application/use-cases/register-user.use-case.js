import {
    AppError,
    ErrorCode,
} from '../../../../shared/index.js';
import {
    EMAIL_ALREADY_REGISTERED,
    USERNAME_ALREADY_TAKEN,
} from '../../domain/auth.constant.js';

export class RegisterUserUseCase {
    constructor({ authUserReader, authUserWriter, passwordHasher }) {
        if (typeof authUserReader?.findByEmailWithPassword !== 'function' || typeof authUserReader?.findByUsername !== 'function') {
            throw new Error(
                'RegisterUserUseCase: authUserReader must implement findByEmailWithPassword and findByUsername methods'
            );
        }
        if (typeof authUserWriter?.createUser !== 'function') {
            throw new Error(
                'RegisterUserUseCase: authUserWriter must implement createUser method'
            );
        }
        if (typeof passwordHasher?.hash !== 'function') {
            throw new Error(
                'RegisterUserUseCase: passwordHasher must implement hash method'
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
            throw new AppError(EMAIL_ALREADY_REGISTERED, ErrorCode.CONFLICT);
        }

        const existingUserByUsername = await this.authUserReader.findByUsername(
            data.username
        );

        if (existingUserByUsername) {
            throw new AppError(USERNAME_ALREADY_TAKEN, ErrorCode.CONFLICT);
        }

        const hashedPassword = await this.passwordHasher.hash(data.password);

        const newUser = await this.authUserWriter.createUser({
            email: data.email,
            username: data.username,
            password: hashedPassword,
            displayName: data.displayName,
            dateOfBirth: data.dateOfBirth,
        });
        return newUser;
    }
}
