import AuthController from './presentation/auth.controller.js';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case.js';
import { createAuthRouter } from './presentation/auth.router.js';

// ── Re-exports (contracts & validators) ──────────────────────────────────────
export {
    loginValidation,
    registerValidation,
} from './presentation/auth.validator.js';

// ── Module factory ────────────────────────────────────────────────────────────

/**
 * Composes the auth module and returns its Express router.
 *
 * @param {{ createUserUseCase, findUserByEmailUseCase, findUserByUsernameUseCase, validateCredentialsUseCase, passwordHasher, tokenService, saltRounds }} deps
 * @returns {{ router: import('express').Router }}
 */
export const createAuthModule = ({
    createUserUseCase,
    findUserByEmailUseCase,
    findUserByUsernameUseCase,
    validateCredentialsUseCase,
    passwordHasher,
    tokenService,
    saltRounds,
}) => {
    const loginUserUseCase = new LoginUserUseCase({
        validateCredentialsUseCase,
        tokenService,
    });

    const registerUserUseCase = new RegisterUserUseCase({
        createUserUseCase,
        findUserByEmailUseCase,
        findUserByUsernameUseCase,
        passwordHasher,
        saltRounds,
    });

    const authController = new AuthController({
        loginUserUseCase,
        registerUserUseCase,
    });

    const router = createAuthRouter(authController);

    return { router };
};
