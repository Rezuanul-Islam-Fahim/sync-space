import { UnauthorizedError } from '../../../../shared/error/index.js';
import { maskEmail } from '../../../../shared/util/index.js';
import { SESSION_EXPIRED_INVALID } from '../../domain/auth-user.constant.js';

export class LogoutUseCase {
    constructor({ tokenVerifier, sessionReader, sessionWriter, logger }) {
        this.tokenVerifier = tokenVerifier;
        this.sessionReader = sessionReader;
        this.sessionWriter = sessionWriter;
        this.logger = logger;
    }

    async execute(data) {
        const {
            sub: authUserId,
            email,
            sessionId,
        } = await this.tokenVerifier.verifyRefreshToken(data.refreshToken);

        const refreshToken = await this.sessionReader.getRefreshToken(
            authUserId,
            sessionId
        );

        if (!refreshToken) {
            throw new UnauthorizedError(SESSION_EXPIRED_INVALID);
        }

        await this.sessionWriter.deleteRefreshToken(sessionId, authUserId);

        this.logger.info('Session cleared successful', {
            authUserId,
            email: maskEmail(email),
        });
    }
}
