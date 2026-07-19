import { AppError, ErrorCode } from '../../../../shared/error/index.js';
import { AuthUser } from '../../domain/auth-user.entity.js';
import { EMAIL_ALREADY_REGISTERED } from '../../domain/auth.constant.js';

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

        const hashedPassword = await this.passwordHasher.hash(data.password);

        const authUser = new AuthUser({
            email: data.email,
            password: hashedPassword,
            isVerified: false,
        });

        const savedUser = await this.authUserWriter.createUser(authUser);

        return savedUser;
    }
}
