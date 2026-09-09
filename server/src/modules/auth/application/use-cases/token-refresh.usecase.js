import {
    NotFoundError,
    UnauthorizedError,
} from '../../../../shared/error/index.js';
import { maskEmail } from '../../../../shared/util/index.js';
import {
    SESSION_EXPIRED_INVALID,
    TOKEN_EXPIRED,
    INVALID_TOKEN,
    USER_UNAVAILABLE,
} from '../../domain/auth-user.constant.js';
import { TokenVerificationError } from '../../infrastructure/security/errors/token-verification.error.js';

export class TokenRefreshUseCase {
    constructor({
        authUserReader,
        tokenGenerator,
        tokenVerifier,
        sessionReader,
        sessionWriter,
        tokenHasher,
        tokenHashComparer,
        logger,
    }) {
        this.authUserReader = authUserReader;
        this.tokenGenerator = tokenGenerator;
        this.tokenVerifier = tokenVerifier;
        this.sessionReader = sessionReader;
        this.sessionWriter = sessionWriter;
        this.tokenHasher = tokenHasher;
        this.tokenHashComparer = tokenHashComparer;
        this.logger = logger;
    }

    async execute(data) {
        try {
            const {
                sub: userId,
                sessionId,
                email,
            } = await this.tokenVerifier.verifyRefreshToken(data.refreshToken);

            const refreshToken = await this.sessionReader.getSession(
                userId,
                sessionId
            );

            if (!refreshToken) {
                throw new UnauthorizedError(SESSION_EXPIRED_INVALID);
            }

            const isTokenMatched = this.tokenHashComparer.compare(
                data.refreshToken,
                refreshToken
            );

            if (!isTokenMatched) {
                this.logger.warn('CRITICAL: Session compromised', {
                    authUserId: userId,
                    sessionId: sessionId,
                });
                await this.sessionWriter.clearSession(userId, sessionId);
                throw new UnauthorizedError(SESSION_EXPIRED_INVALID);
            }

            const user = await this.authUserReader.findById(userId);

            if (!user) {
                throw new NotFoundError(USER_UNAVAILABLE);
            }

            const { token: newToken, refreshToken: newRefreshToken } =
                await this.tokenGenerator.generateTokens({
                    userId,
                    email: user.email,
                    sessionId,
                });

            const hashedRefreshToken = this.tokenHasher.hash(newRefreshToken);

            await this.sessionWriter.initiateSession(
                userId,
                sessionId,
                hashedRefreshToken
            );

            this.logger.info('New session generated (token + refresh-token)', {
                authUserId: userId,
                email: maskEmail(email),
            });

            return { newToken, newRefreshToken };
        } catch (error) {
            if (error instanceof TokenVerificationError) {
                const message = error.isExpired ? TOKEN_EXPIRED : INVALID_TOKEN;
                throw new UnauthorizedError(message);
            }

            throw error;
        }
    }
}
