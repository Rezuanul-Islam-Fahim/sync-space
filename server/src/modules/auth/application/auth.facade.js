import { AuthUserDto } from './dtos/auth-user.dto.js';
import { AccessTokenClaimsDto } from './dtos/access-token-claims.dto.js';

/**
 * Public API Facade for the Auth Bounded Context.
 * Acts as the single entry point for cross-module authentication & credential operations.
 */
export class AuthFacade {
    /**
     * @param {{
     *   registerUserUseCase: import('./use-cases/register-user.usecase.js').RegisterUserUseCase,
     *   deleteAuthUserUseCase: import('./use-cases/delete-auth-user.usecase.js').DeleteAuthUserUseCase,
     *   verifyAccessTokenUseCase: import('./use-cases/verify-access-token.usecase.js').VerifyAccessTokenUseCase
     * }} deps
     */
    constructor({
        registerUserUseCase,
        deleteAuthUserUseCase,
        verifyAccessTokenUseCase,
    }) {
        this.registerUserUseCase = registerUserUseCase;
        this.deleteAuthUserUseCase = deleteAuthUserUseCase;
        this.verifyAccessTokenUseCase = verifyAccessTokenUseCase;
    }

    /**
     * Registers new user authentication credentials.
     *
     * @param {object} credentials
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
     * Verifies access token and maps payload to an intent-revealing claims object.
     *
     * @param {string} token
     * @returns {Promise<AccessTokenClaimsDto>}
     */
    async verifyAccessToken(token) {
        const claims = await this.verifyAccessTokenUseCase.execute(token);
        return AccessTokenClaimsDto.fromClaims(claims);
    }
}
