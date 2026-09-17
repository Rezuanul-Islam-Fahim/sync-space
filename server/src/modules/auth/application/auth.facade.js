import { AuthUserDto } from './dtos/auth-user.dto.js';
import { AccessTokenClaimsDto } from './dtos/access-token-claims.dto.js';
import { UnauthorizedError } from '../../../shared/error/index.js';
import { INVALID_TOKEN } from '../domain/auth-user.constant.js';

/**
 * Public API Facade for the Auth Bounded Context.
 * Acts as the single entry point for cross-module authentication & credential operations.
 */
export class AuthFacade {
    /**
     * @param {{
     *   registerUserUseCase: import('./use-cases/register-user.usecase.js').RegisterUserUseCase,
     *   deleteAuthUserUseCase: import('./use-cases/delete-auth-user.usecase.js').DeleteAuthUserUseCase,
     *   verifyAccessTokenUseCase: import('./use-cases/verify-access-token.usecase.js').VerifyAccessTokenUseCase,
     *   getBlacklistedLoginUseCase: import('./use-cases/get-blacklisted-login.usecase.js').GetBlacklistedLoginUseCase,
     * }} deps
     */
    constructor({
        registerUserUseCase,
        deleteAuthUserUseCase,
        verifyAccessTokenUseCase,
        getBlacklistedLoginUseCase,
    }) {
        this.registerUserUseCase = registerUserUseCase;
        this.deleteAuthUserUseCase = deleteAuthUserUseCase;
        this.verifyAccessTokenUseCase = verifyAccessTokenUseCase;
        this.getBlacklistedLoginUseCase = getBlacklistedLoginUseCase;
    }

    /**
     * Registers new user authentication credentials.
     *
     * @param {{ email: string, password: string }} credentials
     * @returns {Promise<AuthUserDto>}
     */
    async registerUser(credentials) {
        const authUser = await this.registerUserUseCase.execute(credentials);
        return AuthUserDto.fromEntity(authUser);
    }

    /**
     * Deletes an auth user record (used for saga compensating rollback).
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async deleteAuthUser(id) {
        await this.deleteAuthUserUseCase.execute(id);
    }

    /**
     * Verifies an access token and ensures its session is not blacklisted.
     *
     * @param {string} token
     * @returns {Promise<AccessTokenClaimsDto>}
     * @throws {UnauthorizedError} if token is invalid, expired, or session is blacklisted
     */
    async verifyAccessToken(token) {
        const principal = await this.verifyAccessTokenUseCase.execute(token);

        const isBlacklisted = await this.getBlacklistedLoginUseCase.execute(
            principal.jti
        );

        if (isBlacklisted) {
            throw new UnauthorizedError(INVALID_TOKEN);
        }

        return AccessTokenClaimsDto.fromClaims(principal);
    }
}
