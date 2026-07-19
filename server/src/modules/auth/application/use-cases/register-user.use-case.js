import { AppError, ErrorCode } from '../../../../shared/error/index.js';
import { AuthUser } from '../../domain/auth-user.entity.js';
import {
    EMAIL_ALREADY_REGISTERED,
    USERNAME_ALREADY_TAKEN,
} from '../../domain/auth.constant.js';

export class RegisterUserUseCase {
    constructor({
        authUserReader,
        authUserWriter,
        passwordHasher,
        profileCreatorPort,
        logger,
    }) {
        this.authUserReader = authUserReader;
        this.authUserWriter = authUserWriter;
        this.passwordHasher = passwordHasher;
        this.profileCreatorPort = profileCreatorPort;
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

        // Username uniqueness is checked via the profile creator port's
        // underlying store; a duplicate will surface as a persistence error.
        // If you need an explicit pre-check, inject a UsernameCheckerPort.
        const hashedPassword = await this.passwordHasher.hash(data.password);

        // Build the auth credential entity — profile fields are intentionally
        // excluded; they are managed by the user bounded context.
        const authUser = new AuthUser({
            email: data.email,
            password: hashedPassword,
            isVerified: false,
        });

        const savedUser = await this.authUserWriter.createUser(authUser);

        try {
            // Synchronously propagate the new principal into the user bounded
            // context so that the profile record is always created in the same
            // registration transaction flow.
            await this.profileCreatorPort.createProfile({
                userId: savedUser.id,
                registrationData: {
                    email: savedUser.email,
                    username: data.username,
                    displayName: data.displayName ?? null,
                    dateOfBirth: data.dateOfBirth,
                },
            });
        } catch (profileErr) {
            // Compensating action: delete the orphaned credential
            await this.authUserWriter.deleteById(savedUser.id);

            if (profileErr.errorCode === ErrorCode.ALREADY_EXISTS) {
                throw new AppError(
                    USERNAME_ALREADY_TAKEN,
                    ErrorCode.ALREADY_EXISTS
                );
            }
            throw profileErr;
        }

        return savedUser;
    }
}
