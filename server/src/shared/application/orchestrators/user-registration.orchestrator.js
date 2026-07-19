import { AppError, ErrorCode } from '../../error/index.js';
import { USERNAME_ALREADY_TAKEN } from '../../../modules/auth/domain/auth.constant.js';

export class UserRegistrationOrchestrator {
    constructor({
        registerUserUseCase,
        createUserUseCase,
        authUserWriter,
        logger,
    }) {
        this.registerUserUseCase = registerUserUseCase;
        this.createUserUseCase = createUserUseCase;
        this.authUserWriter = authUserWriter;
        this.logger = logger;
    }

    async execute(data) {
        // Step 1: Create auth credential
        const savedAuthUser = await this.registerUserUseCase.execute(data);

        try {
            // Step 2: Create user profile in User module
            await this.createUserUseCase.execute({
                id: savedAuthUser.id,
                email: savedAuthUser.email,
                username: data.username,
                displayName: data.displayName ?? null,
                dateOfBirth: data.dateOfBirth,
            });
        } catch (profileErr) {
            // Compensating action: rollback credential creation
            await this.authUserWriter.deleteById(savedAuthUser.id);

            if (profileErr.errorCode === ErrorCode.ALREADY_EXISTS) {
                throw new AppError(
                    USERNAME_ALREADY_TAKEN,
                    ErrorCode.ALREADY_EXISTS
                );
            }
            throw profileErr;
        }

        return savedAuthUser;
    }
}
