import { UnauthorizedError } from '../../../../shared/error/index.js';
import { maskEmail } from '../../../../shared/util/index.js';
import { SESSION_EXPIRED_INVALID } from '../../domain/auth-user.constant.js';

export class LogoutUseCase {
    constructor({
        tokenVerifier,
        refreshTokenReader,
        refreshTokenWriter,
        logger,
    }) {
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
        } = await this.tokenVerifier.verifyRefreshToken(data.refreshToken);

        const refreshToken = await this.refreshTokenReader.get(
            authUserId,
            sessionId
        );

        if (!refreshToken) {
            throw new UnauthorizedError(SESSION_EXPIRED_INVALID);
        }

        await this.refreshTokenWriter.delete(sessionId, authUserId);

        this.logger.info('Session cleared successful', {
            authUserId,
            email: maskEmail(email),
        });
    }
}
