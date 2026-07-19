import { config } from '../../config/index.js';
import { AuthController } from './presentation/auth.controller.js';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case.js';
import { createAuthRouter } from './presentation/auth.router.js';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher.adapter.js';
import { UserRegistrationOrchestrator } from '../../shared/application/orchestrators/user-registration.orchestrator.js';

/**
 * Composes the auth module and returns its Express router.
 *
 * @param {{
 *   authUserReader: import('./application/ports/auth-user-reader.port.js').AuthUserReaderPort,
 *   authUserWriter: import('./application/ports/auth-user-writer.port.js').AuthUserWriterPort,
 *   createUserUseCase: import('../../../shared/application/orchestrators/user-registration.orchestrator.js').UserRegistrationOrchestrator, // actually import CreateUserUseCase but typing is fine for now
 *   tokenGenerator,
 *   logger?: import('../../shared/ports/logger.port.js').LoggerPort
 * }} deps
 * @returns {{ router: import('express').Router }}
 */
export const composeAuthModule = ({
    authUserReader,
    authUserWriter,
    createUserUseCase,
    tokenGenerator,
    logger,
}) => {
    const passwordHasher = new BcryptPasswordHasher({
        saltRounds: config.auth.saltRounds,
    });

    const loginUserUseCase = new LoginUserUseCase({
        authUserReader,
        passwordHasher,
        tokenGenerator,
        logger,
    });

    const registerUserUseCase = new RegisterUserUseCase({
        authUserReader,
        authUserWriter,
        passwordHasher,
        logger,
    });

    const userRegistrationOrchestrator = new UserRegistrationOrchestrator({
        registerUserUseCase,
        createUserUseCase,
        authUserWriter,
        logger,
    });

    const authController = new AuthController({
        loginUserUseCase,
        userRegistrationOrchestrator,
        logger,
    });

    const router = createAuthRouter(authController);

    return { router };
};
