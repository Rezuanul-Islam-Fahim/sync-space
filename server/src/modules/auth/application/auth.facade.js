import { AppError, ErrorCode } from '../../../shared/error/index.js';
import { INVALID_TOKEN, TOKEN_EXPIRED } from '../domain/auth-user.constant.js';
import { TokenVerificationError } from '../domain/errors/token-verification.error.js';

/**
 * Public API Facade for the Auth Bounded Context.
 * Acts as the single entry point for cross-module authentication & credential operations.
 */
export class AuthFacade {
    /**
     * @param {{
     *   loginUserUseCase: import('./use-cases/login-user.usecase.js').LoginUserUseCase,
     *   registerUserUseCase: import('./use-cases/register-user.usecase.js').RegisterUserUseCase,
     *   deleteAuthUserUseCase: import('./use-cases/delete-auth-user.usecase.js').DeleteAuthUserUseCase,
     *   tokenVerifier: import('./ports/token-verifier.port.js').TokenVerifierPort
     * }} deps
     */
    constructor({
        loginUserUseCase,
        registerUserUseCase,
        deleteAuthUserUseCase,
        tokenVerifier,
    }) {
        this.loginUserUseCase = loginUserUseCase;
        this.registerUserUseCase = registerUserUseCase;
        this.deleteAuthUserUseCase = deleteAuthUserUseCase;
        this.tokenVerifier = tokenVerifier;
    }

    /**
     * Authenticates user credentials and issues access tokens.
     *
     * @param {object} credentials
     * @returns {Promise<object>}
     */
    loginUser(credentials) {
        return this.loginUserUseCase.execute(credentials);
    }

    /**
     * Registers new user authentication credentials.
     *
     * @param {object} credentials
     * @returns {Promise<import('../domain/auth-user.entity.js').AuthUser>}
     */
    registerUser(credentials) {
        return this.registerUserUseCase.execute(credentials);
    }

    /**
     * Deletes an auth user record (used for saga compensating rollback).
     *
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    deleteAuthUser(id) {
        return this.deleteAuthUserUseCase.execute(id);
    }

    /**
     * Verifies access token and maps payload to an intent-revealing principal object.
     *
     * @param {string} token
     * @returns {Promise<{ id: string, email: string }>}
     * @throws {AppError} if token is invalid or verification fails
     */
    async verifyAccessToken(token) {
        try {
            const decoded = await this.tokenVerifier.verifyAccessToken(token);
            return { id: decoded.sub, email: decoded.email };
        } catch (error) {
            if (error instanceof TokenVerificationError) {
                const message = error.isExpired ? TOKEN_EXPIRED : INVALID_TOKEN;
                throw new AppError(message, ErrorCode.UNAUTHENTICATED);
            }
            throw error;
        }
    }
}
