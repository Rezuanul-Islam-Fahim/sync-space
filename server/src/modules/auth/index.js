import AuthController from './auth.controller.js';
import { LoginUserUseCase } from './use-cases/login-user.use-case.js';
import { RegisterUserUseCase } from './use-cases/register-user.use-case.js';
import { createAuthRouter } from './auth.router.js';

// ── Re-exports (contracts & validators) ──────────────────────────────────────
export { loginValidation, registerValidation } from './auth.validator.js';
export { TokenServicePort } from './ports/token-service.port.js';

// ── Module factory ────────────────────────────────────────────────────────────

/**
 * Composes the auth module and returns its Express router.
 *
 * @param {{ userRepository, passwordHasher, tokenService, saltRounds }} deps
 * @returns {{ router: import('express').Router }}
 */
export const createAuthModule = ({
    userRepository,
    passwordHasher,
    tokenService,
    saltRounds,
}) => {
    const loginUserUseCase = new LoginUserUseCase({
        userRepository,
        passwordHasher,
        tokenService,
    });

    const registerUserUseCase = new RegisterUserUseCase({
        userRepository,
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
