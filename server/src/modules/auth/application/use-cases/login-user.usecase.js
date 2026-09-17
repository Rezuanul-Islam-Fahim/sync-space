import { randomUUID } from 'node:crypto';
import { UnauthorizedError } from '../../../../shared/error/index.js';
import { maskEmail } from '../../../../shared/util/index.js';
import {
    INVALID_CREDENTIALS,
    DUMMY_PASSWORD_HASH,
} from '../../domain/auth-user.constant.js';

/**
 * Use case for validating user login credentials and issuing authentication tokens.
 */
export class LoginUserUseCase {
    /**
     * @param {{
     *   authUserReader: import('../ports/auth-user-reader.port.js').AuthUserByEmailReaderPort,
     *   passwordComparer: import('../ports/password-hasher.port.js').PasswordComparerPort,
     *   tokenGenerator: import('../ports/token-generator.port.js').TokenGeneratorPort,
     *   sessionStore: import('../ports/session-store.port.js').SessionStorePort,
     *   tokenHasher: import('../ports/token-hasher.port.js').TokenHasherPort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({
        authUserReader,
        passwordComparer,
        tokenGenerator,
        sessionStore,
        tokenHasher,
        logger,
    }) {
        this.authUserReader = authUserReader;
        this.passwordComparer = passwordComparer;
        this.tokenGenerator = tokenGenerator;
        this.sessionStore = sessionStore;
        this.tokenHasher = tokenHasher;
        this.logger = logger;
    }

    /**
     * Authenticates user credentials and returns user domain entity with tokens.
     *
     * @param {{ email: string, password: string }} data
     * @returns {Promise<{ user: import('../../domain/auth-user.entity.js').AuthUser, tokens: { accessToken: string, refreshToken: string } }>}
     */
    async execute(data) {
        const user = await this.authUserReader.findByEmail(data.email);

        if (!user) {
            // Mitigate timing attack/user enumeration: run password comparison against dummy hash
            await this.passwordComparer.compare(
                data.password,
                DUMMY_PASSWORD_HASH
            );
            throw new UnauthorizedError(INVALID_CREDENTIALS);
        }

        const isPasswordMatch = await this.passwordComparer.compare(
            data.password,
            user.password
        );

        if (!isPasswordMatch) {
            throw new UnauthorizedError(INVALID_CREDENTIALS);
        }

        const sessionId = randomUUID();

        const tokens = await this.tokenGenerator.generateTokens({
            userId: user.id,
            email: user.email,
            sessionId,
        });

        const hashedRefreshToken = this.tokenHasher.hash(tokens.refreshToken);

        await this.sessionStore.saveSession(
            user.id,
            sessionId,
            hashedRefreshToken
        );

        this.logger?.info?.('User login successful', {
            authUserId: user.id,
            email: maskEmail(user.email),
        });

        return {
            user,
            tokens,
        };
    }
}
