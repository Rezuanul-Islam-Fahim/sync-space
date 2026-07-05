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
 * @param {{ userService, passwordHasher, tokenService, saltRounds }} deps
 * @returns {{ router: import('express').Router }}
 */
export const createAuthModule = ({
    userService,
    passwordHasher,
    tokenService,
    saltRounds,
}) => {
    const loginUserUseCase = new LoginUserUseCase({
        userService,
        passwordHasher,
        tokenService,
    });

    const registerUserUseCase = new RegisterUserUseCase({
        userService,
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
