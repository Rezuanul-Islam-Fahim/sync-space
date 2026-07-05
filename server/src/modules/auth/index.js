import AuthController from './presentation/auth.controller.js';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case.js';
import { createAuthRouter } from './presentation/auth.router.js';

// ── Re-exports (contracts & validators) ──────────────────────────────────────
export {
    loginValidation,
    registerValidation,
} from './presentation/auth.validator.js';
export { AuthUserProviderPort } from './application/ports/auth-user-provider.port.js';

// ── Module factory ────────────────────────────────────────────────────────────

/**
 * Composes the auth module and returns its Express router.
 *
 * @param {{ authUserProvider, passwordHasher, tokenService, saltRounds }} deps
 * @returns {{ router: import('express').Router }}
 */
export const createAuthModule = ({
    authUserProvider,
    passwordHasher,
    tokenService,
    saltRounds,
}) => {
    const loginUserUseCase = new LoginUserUseCase({
        authUserProvider,
        tokenService,
    });

    const registerUserUseCase = new RegisterUserUseCase({
        authUserProvider,
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
