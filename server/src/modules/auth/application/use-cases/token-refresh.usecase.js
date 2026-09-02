import { UnauthorizedError } from '../../../../shared/error/index.js';
import { maskEmail } from '../../../../shared/util/index.js';
import { SESSION_EXPIRED_INVALID } from '../../domain/auth-user.constant.js';

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
        const tokenPayload = await this.tokenVerifier.verifyRefreshToken(
            data.token
        );

        const refreshToken = await this.refreshTokenReader.get(
            tokenPayload.sub,
            tokenPayload.sessionId
        );

        if (!refreshToken || data.token !== refreshToken) {
            throw new UnauthorizedError(SESSION_EXPIRED_INVALID);
        }

        const { token: newToken, refreshToken: newRefreshToken } =
            await this.tokenGenerator.generateTokens(
                tokenPayload.sub,
                tokenPayload.email,
                tokenPayload.sessionId
            );

        await this.refreshTokenWriter.store(
            tokenPayload.sessionId,
            tokenPayload.sub,
            newRefreshToken
        );

        this.logger.info('New session generated (token + refresh-token)', {
            authUserId: tokenPayload.sub,
            email: maskEmail(tokenPayload.email),
        });

        return { newToken, newRefreshToken };
    }
}
