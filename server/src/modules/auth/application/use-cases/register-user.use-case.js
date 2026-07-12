import { AppError, ErrorCode } from '../../../../shared/index.js';
import {
    EMAIL_ALREADY_REGISTERED,
    USERNAME_ALREADY_TAKEN,
} from '../../domain/auth.constant.js';

export class RegisterUserUseCase {
    constructor({ authUserReader, authUserWriter, passwordHasher, logger }) {
        this.authUserReader = authUserReader;
        this.authUserWriter = authUserWriter;
        this.passwordHasher = passwordHasher;
        this.logger = logger;
    }

    async execute(data) {
        const existingEmail = await this.authUserReader.findByEmail(data.email);
        if (existingEmail) {
            throw new AppError(
                EMAIL_ALREADY_REGISTERED,
                ErrorCode.ALREADY_EXISTS
            );
        }

        const existingUsername = await this.authUserReader.findByUsername(
            data.username
        );
        if (existingUsername) {
            throw new AppError(
                USERNAME_ALREADY_TAKEN,
                ErrorCode.ALREADY_EXISTS
            );
        }

        const hashedPassword = await this.passwordHasher.hash(data.password);
        return this.authUserWriter.createUser({
            ...data,
            password: hashedPassword,
        });
    }
}
