import { AuthUserDto } from './dtos/auth-user.dto.js';

/**
 * Public API Facade for the Auth Bounded Context.
 * Acts as the single entry point for cross-module authentication & credential operations.
 */
export class AuthFacade {
    /**
     * @param {{
     *   registerUserUseCase: import('./use-cases/register-user.usecase.js').RegisterUserUseCase,
     *   deleteAuthUserUseCase: import('./use-cases/delete-auth-user.usecase.js').DeleteAuthUserUseCase,
     * }} deps
     */
    constructor({ registerUserUseCase, deleteAuthUserUseCase }) {
        this.registerUserUseCase = registerUserUseCase;
        this.deleteAuthUserUseCase = deleteAuthUserUseCase;
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
}
