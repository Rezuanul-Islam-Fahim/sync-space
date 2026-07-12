import { AppError, ErrorCode } from '../../../../shared/index.js';
import { AuthUser } from '../../domain/auth-user.entity.js';
import {
    EMAIL_ALREADY_REGISTERED,
    USERNAME_ALREADY_TAKEN,
} from '../../../../shared/constant/index.js';

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

        const authUser = await AuthUser.create(data, this.passwordHasher);
        
        const profileData = {
            displayName: data.displayName,
            dateOfBirth: data.dateOfBirth
        };

        const savedUser = await this.authUserWriter.createUser(authUser, profileData);
        return savedUser;
    }
}
