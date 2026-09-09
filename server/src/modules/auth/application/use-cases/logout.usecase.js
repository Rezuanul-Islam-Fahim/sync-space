import { maskEmail } from '../../../../shared/util/index.js';
import { TokenExpiredError } from '../../infrastructure/security/errors/token-verification.error.js';

export class LogoutUseCase {
    constructor({ tokenVerifier, sessionReader, sessionWriter, logger }) {
        this.tokenVerifier = tokenVerifier;
        this.sessionReader = sessionReader;
        this.sessionWriter = sessionWriter;
        this.logger = logger;
    }

    async execute(data) {
        try {
            const {
                sub: authUserId,
                email,
                sessionId,
            } = await this.tokenVerifier.verifyRefreshToken(data.refreshToken);

            const session = await this.sessionReader.getSession(
                authUserId,
                sessionId
            );

            if (session) {
                await this.sessionWriter.clearSession(sessionId, authUserId);

                try {
                    const { jti, exp } =
                        await this.tokenVerifier.verifyAccessToken(data.token);

                    const ttl = exp - Math.floor(Date.now() / 1000);

                    await this.sessionWriter.blacklistLoginSession(jti, ttl);
                } catch (error) {
                    if (!(error instanceof TokenExpiredError)) {
                        throw error;
                    }
                }

                this.logger.info('Session cleared successfully', {
                    authUserId,
                    email: maskEmail(email),
                });
            }
        } catch (error) {
            if (!(error instanceof TokenExpiredError)) {
                throw error;
            }
        }
    }
}
