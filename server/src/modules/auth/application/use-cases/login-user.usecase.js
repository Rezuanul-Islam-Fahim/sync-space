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
     *   authUserReader: import('../ports/auth-user-reader.port.js').AuthUserReaderPort,
     *   passwordComparer: import('../ports/password-hasher.port.js').PasswordComparerPort,
     *   tokenGenerator: import('../ports/token-generator.port.js').TokenGeneratorPort,
     *   refreshTokenWriter: import('../ports/refresh-token-writer.port.js').RefreshTokenWriterPort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({
        authUserReader,
        passwordComparer,
        tokenGenerator,
        refreshTokenWriter,
        logger,
    }) {
        this.authUserReader = authUserReader;
        this.passwordComparer = passwordComparer;
        this.tokenGenerator = tokenGenerator;
        this.refreshTokenWriter = refreshTokenWriter;
        this.logger = logger;
    }

    /**
     * Authenticates user credentials and returns user domain entity with tokens.
     *
     * @param {{ email: string, password: string }} data
     * @returns {Promise<{ user: import('../../domain/auth-user.entity.js').AuthUser, tokens: { token: string, refreshToken: string } }>}
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

        const sessionId = data.deviceId || randomUUID();

        const tokens = await this.tokenGenerator.generateTokens(
            user.id,
            user.email,
            sessionId
        );

        await this.refreshTokenWriter.store(
            sessionId,
            user.id,
            tokens.refreshToken
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
