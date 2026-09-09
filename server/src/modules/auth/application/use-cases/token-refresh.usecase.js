import { randomUUID } from 'node:crypto';
import { UnauthorizedError } from '../../../../shared/error/index.js';
import { maskEmail } from '../../../../shared/util/index.js';
import {
    REFRESH_TOKEN_HASH_ALGORITHM,
    REFRESH_TOKEN_HASH_DIGEST,
    SESSION_EXPIRED_INVALID,
    USER_UNAVAILABLE,
} from '../../domain/auth-user.constant.js';

export class TokenRefreshUseCase {
    constructor({
        authUserReader,
        tokenGenerator,
        tokenVerifier,
        sessionReader,
        sessionWriter,
        tokenHasher,
        logger,
    }) {
        this.authUserReader = authUserReader;
        this.tokenGenerator = tokenGenerator;
        this.tokenVerifier = tokenVerifier;
        this.sessionReader = sessionReader;
        this.sessionWriter = sessionWriter;
        this.tokenHasher = tokenHasher;
        this.logger = logger;
    }

    async execute(data) {
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

        if (data.refreshToken !== refreshToken) {
            this.logger.warn('CRITICAL: Session compromised', {
                authUserId: userId,
                sessionId: sessionId,
            });
            await this.sessionWriter.clearSession(sessionId, userId);
            throw new UnauthorizedError(SESSION_EXPIRED_INVALID);
        }

        const user = await this.authUserReader.findById(userId);

        if (!user) {
            throw new UnauthorizedError(USER_UNAVAILABLE);
        }

        const newSessionId = randomUUID();

        const { token: newToken, refreshToken: newRefreshToken } =
            await this.tokenGenerator.generateTokens({
                userId,
                email: user.email,
                sessionId: newSessionId,
            });

        const hashedRefreshToken = this.tokenHasher.hash(
            REFRESH_TOKEN_HASH_ALGORITHM,
            REFRESH_TOKEN_HASH_DIGEST,
            newRefreshToken
        );

        await this.sessionWriter.initiateSession(
            newSessionId,
            userId,
            hashedRefreshToken
        );

        this.logger.info('New session generated (token + refresh-token)', {
            authUserId: userId,
            email: maskEmail(email),
        });

        return { newToken, newRefreshToken };
    }
}
