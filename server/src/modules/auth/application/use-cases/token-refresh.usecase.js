import { UnauthorizedError } from '../../../../shared/error/index.js';
import {
    TOKEN_EXPIRED,
    INVALID_TOKEN,
    USER_UNAVAILABLE,
} from '../../domain/auth-user.constant.js';
import { TokenVerificationError } from '../errors/token-verification.error.js';

/**
 * Use case for refreshing authentication tokens and managing session lifecycle.
 */
export class TokenRefreshUseCase {
    /**
     * @param {{
     *   authUserReader: import('../ports/auth-user-reader.port.js').AuthUserByIdReaderPort,
     *   sessionValidatorService: import('../services/session-validator.service.js').SessionValidatorService,
     *   sessionRotationService: import('../services/session-rotation.service.js').SessionRotationService,
     *   tokenGenerator: import('../ports/token-generator.port.js').TokenGeneratorPort,
     *   tokenVerifier: import('../ports/token-verifier.port.js').TokenVerifierPort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({
        authUserReader,
        sessionValidatorService,
        sessionRotationService,
        tokenGenerator,
        tokenVerifier,
        logger,
    }) {
        this.authUserReader = authUserReader;
        this.sessionValidatorService = sessionValidatorService;
        this.sessionRotationService = sessionRotationService;
        this.tokenGenerator = tokenGenerator;
        this.tokenVerifier = tokenVerifier;
        this.logger = logger;
    }

    /**
     * Executes the token refresh process, verifying the incoming refresh token and generating new ones.
     *
     * @param {{ refreshToken: string }} data
     * @returns {Promise<{ accessToken: string, refreshToken: string }>}
     */
    async execute(data) {
        try {
            const { sub: userId, sessionId } =
                await this.tokenVerifier.verifyRefreshToken(data.refreshToken);

            const validatedSession =
                await this.sessionValidatorService.validateSession(
                    userId,
                    sessionId,
                    data.refreshToken
                );

            if (validatedSession.cache) {
                return validatedSession.tokens;
            }

            const user = await this.authUserReader.findById(userId);

            if (!user) {
                await this.sessionValidatorService.invalidateSession(
                    userId,
                    sessionId
                );
                throw new UnauthorizedError(USER_UNAVAILABLE);
            }

            const newLockedSession =
                await this.sessionRotationService.rotateSessionWithLock(
                    validatedSession.refreshTokenHash,
                    userId,
                    sessionId,
                    user.email,
                    async () =>
                        await this.tokenGenerator.generateTokens({
                            userId,
                            email: user.email,
                            sessionId,
                        })
                );

            return {
                accessToken: newLockedSession.accessToken,
                refreshToken: newLockedSession.refreshToken,
            };
        } catch (error) {
            if (error instanceof TokenVerificationError) {
                const message = error.isExpired ? TOKEN_EXPIRED : INVALID_TOKEN;
                throw new UnauthorizedError(message);
            }

            throw error;
        }
    }
}
