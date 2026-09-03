import { UnauthorizedError } from '../../../../shared/error/index.js';
import { maskEmail } from '../../../../shared/util/index.js';
import { SESSION_EXPIRED_INVALID } from '../../domain/auth-user.constant.js';

export class TokenRefreshUseCase {
    constructor({
        tokenGenerator,
        tokenVerifier,
        sessionReader,
        sessionWriter,
        logger,
    }) {
        this.tokenGenerator = tokenGenerator;
        this.tokenVerifier = tokenVerifier;
        this.sessionReader = sessionReader;
        this.sessionWriter = sessionWriter;
        this.logger = logger;
    }

    async execute(data) {
        const tokenPayload = await this.tokenVerifier.verifyRefreshToken(
            data.token
        );

        const refreshToken = await this.sessionReader.getSession(
            tokenPayload.sub,
            tokenPayload.sessionId
        );

        if (!refreshToken) {
            throw new UnauthorizedError(SESSION_EXPIRED_INVALID);
        }

        if (data.token !== refreshToken) {
            this.logger.warn('CRITICAL: Session compromised', {
                authUserId: tokenPayload.sub,
                sessionId: tokenPayload.sessionId,
            });
            await this.sessionWriter.clearSession(
                tokenPayload.sessionId,
                tokenPayload.sub
            );
            throw new UnauthorizedError(SESSION_EXPIRED_INVALID);
        }

        const { token: newToken, refreshToken: newRefreshToken } =
            await this.tokenGenerator.generateTokens({
                userId: tokenPayload.sub,
                email: tokenPayload.email,
                sessionId: tokenPayload.sessionId,
            });

        await this.sessionWriter.initiateSession(
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
