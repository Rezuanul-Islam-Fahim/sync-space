import { AuthUserDto } from './dtos/auth-user.dto.js';

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
     *   verifyAccessTokenUseCase: import('./use-cases/verify-access-token.usecase.js').VerifyAccessTokenUseCase
     * }} deps
     */
    constructor({
        loginUserUseCase,
        registerUserUseCase,
        deleteAuthUserUseCase,
        verifyAccessTokenUseCase,
    }) {
        this.loginUserUseCase = loginUserUseCase;
        this.registerUserUseCase = registerUserUseCase;
        this.deleteAuthUserUseCase = deleteAuthUserUseCase;
        this.verifyAccessTokenUseCase = verifyAccessTokenUseCase;
    }

    /**
     * Authenticates user credentials and issues access tokens.
     *
     * @param {object} credentials
     * @returns {Promise<{ user: AuthUserDto, tokens: object }>}
     */
    async loginUser(credentials) {
        const result = await this.loginUserUseCase.execute(credentials);
        return {
            user: AuthUserDto.fromEntity(result.user),
            tokens: result.tokens,
        };
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
     */
    verifyAccessToken(token) {
        return this.verifyAccessTokenUseCase.execute(token);
    }
}
