import { AuthController } from './presentation/auth.controller.js';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case.js';
import { createAuthRouter } from './presentation/auth.router.js';

/**
 * Composes the auth module and returns its Express router.
 *
 * @param {{ authUserReader, authUserWriter, passwordHasher, tokenGenerator, validateCredentials, logger?: import('../../shared/ports/logger.port.js').LoggerPort }} deps
 * @returns {{ router: import('express').Router }}
 */
export const composeAuthModule = ({
    authUserReader,
    authUserWriter,
    passwordHasher,
    tokenGenerator,
    validateCredentials,
    logger: _logger,
}) => {
    const loginUserUseCase = new LoginUserUseCase({
        validateCredentials,
        tokenGenerator,
    });

    const registerUserUseCase = new RegisterUserUseCase({
        authUserReader,
        authUserWriter,
        passwordHasher,
    });

    const authController = new AuthController({
        loginUserUseCase,
        registerUserUseCase,
    });

    const router = createAuthRouter(authController);

    return { router };
};
