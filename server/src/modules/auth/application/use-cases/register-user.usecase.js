import { AuthUser } from '../../domain/auth-user.entity.js';

export class RegisterUserUseCase {
    constructor({ authUserWriter, passwordHasher, logger }) {
        this.authUserWriter = authUserWriter;
        this.passwordHasher = passwordHasher;
        this.logger = logger;
    }

    async execute(data) {
        const hashedPassword = await this.passwordHasher.hash(data.password);

        const authUser = new AuthUser({
            email: data.email,
            password: hashedPassword,
            isVerified: false,
        });

        const savedUser = await this.authUserWriter.createUser(authUser);

        this.logger?.info?.('Auth credentials registered successfully', {
            authUserId: savedUser.id,
            email: savedUser.email,
        });

        return savedUser;
    }
}
