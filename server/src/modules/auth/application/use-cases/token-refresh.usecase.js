import { UnauthorizedError } from '../../../../shared/error/index.js';
import { maskEmail } from '../../../../shared/util/index.js';

export class TokenRefreshUseCase {
    constructor({
        tokenGenerator,
        tokenVerifier,
        refreshTokenReader,
        refreshTokenWriter,
        logger,
    }) {
        this.tokenGenerator = tokenGenerator;
        this.tokenVerifier = tokenVerifier;
        this.refreshTokenReader = refreshTokenReader;
        this.refreshTokenWriter = refreshTokenWriter;
        this.logger = logger;
    }

    async execute(data) {
        const {
            sub: authUserId,
            email,
            sessionId,
        } = await this.tokenVerifier.verifyRefreshToken(data.token);

        const refreshToken = await this.refreshTokenReader.get(
            authUserId,
            sessionId
        );

        if (!refreshToken || data.token !== refreshToken) {
            throw new UnauthorizedError('Session expired or invalid');
        }

        const { token: newToken, refreshToken: newRefreshToken } =
            await this.tokenGenerator.generateTokens(
                authUserId,
                email,
                sessionId
            );

        await this.refreshTokenWriter.store(
            sessionId,
            authUserId,
            refreshToken
        );

        this.logger.info('New session generated (token + refresh-token)', {
            authUserId,
            email: maskEmail(email),
        });

        return { newToken, newRefreshToken };
    }
}
