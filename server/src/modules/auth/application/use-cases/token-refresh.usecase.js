import { randomUUID } from 'node:crypto';
import {
    TimedOutError,
    UnauthorizedError,
} from '../../../../shared/error/index.js';
import { maskEmail, waitedResponse } from '../../../../shared/util/index.js';
import {
    TOKEN_EXPIRED,
    INVALID_TOKEN,
    USER_UNAVAILABLE,
    TOKEN_REFRESH_TIMEOUT,
    GET_CACHED_SESSION_WAITING_TIME,
    GET_CACHED_SESSION_POLLING_INTERVAL,
} from '../../domain/auth-user.constant.js';
import { TokenVerificationError } from '../errors/token-verification.error.js';

/**
 * Use case for refreshing authentication tokens and managing session lifecycle.
 */
export class TokenRefreshUseCase {
    /**
     * @param {{
     *   authUserReader: import('../ports/auth-user-reader.port.js').AuthUserByIdReaderPort,
     *   sessionRotationService: import('../services/session-rotation.service.js').SessionRotationService,
     *   tokenGenerator: import('../ports/token-generator.port.js').TokenGeneratorPort,
     *   tokenVerifier: import('../ports/token-verifier.port.js').TokenVerifierPort,
     *   sessionStore: import('../ports/session-store.port.js').SessionStorePort,
     *   sessionRefreshLock: import('../ports/session-refresh-lock.port.js').SessionRefreshLockPort,
     *   tokenHasher: import('../ports/token-hasher.port.js').TokenHasherPort,
     *   tokenHashComparer: import('../ports/token-hasher.port.js').TokenHashComparerPort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({
        authUserReader,
        sessionRotationService,
        tokenGenerator,
        tokenVerifier,
        sessionStore,
        sessionRefreshLock,
        tokenHasher,
        tokenHashComparer,
        logger,
    }) {
        this.authUserReader = authUserReader;
        this.sessionRotationService = sessionRotationService;
        this.tokenGenerator = tokenGenerator;
        this.tokenVerifier = tokenVerifier;
        this.sessionStore = sessionStore;
        this.sessionRefreshLock = sessionRefreshLock;
        this.tokenHasher = tokenHasher;
        this.tokenHashComparer = tokenHashComparer;
        this.logger = logger;
    }

    /**
     * Executes the token refresh process, verifying the incoming refresh token and generating new ones.
     *
     * @param {{ refreshToken: string }} data
     * @returns {Promise<{ accessToken: string, refreshToken: string }>}
     */
    async execute(data) {
        let sessionLockIdentifier;
        let refreshTokenHash;

        try {
            const {
                sub: userId,
                sessionId,
                email,
            } = await this.tokenVerifier.verifyRefreshToken(data.refreshToken);

            const validatedSession =
                await this.sessionRotationService.validateSession(
                    userId,
                    sessionId,
                    data.refreshToken
                );

            if (validatedSession.cache) {
                return validatedSession.tokens;
            }

            refreshTokenHash = validatedSession.refreshTokenHash;

            const user = await this.authUserReader.findById(userId);

            if (!user) {
                await this.sessionRotationService.invalidateSession(
                    userId,
                    sessionId
                );
                throw new UnauthorizedError(USER_UNAVAILABLE);
            }

            sessionLockIdentifier = randomUUID();

            const locked = await this.sessionRefreshLock.acquireLock(
                refreshTokenHash,
                sessionLockIdentifier
            );

            if (!locked) {
                const cachedSessionResult = await waitedResponse({
                    waitingTime: GET_CACHED_SESSION_WAITING_TIME,
                    pollInterval: GET_CACHED_SESSION_POLLING_INTERVAL,
                    resultCallback: async () =>
                        await this.sessionRefreshLock.getCachedSession(
                            refreshTokenHash
                        ),
                });

                if (cachedSessionResult) {
                    return {
                        accessToken: cachedSessionResult.accessToken,
                        refreshToken: cachedSessionResult.refreshToken,
                    };
                } else {
                    throw new TimedOutError(TOKEN_REFRESH_TIMEOUT);
                }
            }

            const {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            } = await this.tokenGenerator.generateTokens({
                userId,
                email: user.email,
                sessionId,
            });

            await this.sessionRefreshLock.cacheSession(
                refreshTokenHash,
                newAccessToken,
                newRefreshToken
            );

            const hashedNewRefreshToken =
                this.tokenHasher.hash(newRefreshToken);

            await this.sessionStore.saveSession(
                userId,
                sessionId,
                hashedNewRefreshToken
            );

            this.logger.info(
                'New session generated (access-token + refresh-token)',
                {
                    authUserId: userId,
                    email: maskEmail(email),
                }
            );

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error) {
            if (error instanceof TokenVerificationError) {
                const message = error.isExpired ? TOKEN_EXPIRED : INVALID_TOKEN;
                throw new UnauthorizedError(message);
            }

            throw error;
        } finally {
            if (sessionLockIdentifier && refreshTokenHash) {
                try {
                    await this.sessionRefreshLock.releaseLock(
                        refreshTokenHash,
                        sessionLockIdentifier
                    );
                } catch (releaseError) {
                    this.logger?.warn?.(
                        'Failed to release session refresh lock in finally block',
                        {
                            refreshTokenHash,
                            sessionLockIdentifier,
                            error: releaseError.message,
                        }
                    );
                }
            }
        }
    }
}
