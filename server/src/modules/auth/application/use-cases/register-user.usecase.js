import { AuthUser } from '../../domain/auth-user.entity.js';
import { maskEmail } from '../../../../shared/util/index.js';

/**
 * Use case for hashing raw passwords and persisting new user auth credentials.
 */
export class RegisterUserUseCase {
    /**
     * @param {{
     *   authUserWriter: import('../ports/auth-user-writer.port.js').AuthUserWriterPort,
     *   passwordHasher: import('../ports/password-hasher.port.js').PasswordHasherPort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ authUserWriter, passwordHasher, logger }) {
        this.authUserWriter = authUserWriter;
        this.passwordHasher = passwordHasher;
        this.logger = logger;
    }

    /**
     * Executes registration of new auth credentials.
     *
     * @param {{ email: string, password: string }} data
     * @returns {Promise<import('../../domain/auth-user.entity.js').AuthUser>}
     */
    async execute(data) {
        const hashedPassword = await this.passwordHasher.hash(data.password);

        const authUser = AuthUser.create({
            email: data.email,
            password: hashedPassword,
            isVerified: false,
        });

        const savedUser = await this.authUserWriter.createUser(authUser);

        this.logger?.info?.('Auth credentials registered successfully', {
            authUserId: savedUser.id,
            email: maskEmail(savedUser.email),
        });

        return savedUser;
    }
}
