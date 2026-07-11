import { AuthController } from './presentation/auth.controller.js';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case.js';
import { ValidateCredentialsUseCase } from './application/use-cases/validate-credentials.use-case.js';
import { createAuthRouter } from './presentation/auth.router.js';

/**
 * Composes the auth module and returns its Express router.
 *
 * @param {{ authUserReader, authUserWriter, passwordHasher, tokenGenerator, logger?: import('../../shared/ports/logger.port.js').LoggerPort }} deps
 * @returns {{ router: import('express').Router }}
 */
export const composeAuthModule = ({
    authUserReader,
    authUserWriter,
    passwordHasher,
    tokenGenerator,
    logger: _logger,
}) => {
    const validateCredentialsUseCase = new ValidateCredentialsUseCase({
        authUserReader,
        passwordHasher,
    });

    const loginUserUseCase = new LoginUserUseCase({
        validateCredentials: validateCredentialsUseCase,
        tokenGenerator,
    });

    const registerUserUseCase = new RegisterUserUseCase({
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
