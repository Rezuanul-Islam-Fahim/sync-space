import { config } from '../../config/index.js';
import { AuthFacade } from './application/auth.facade.js';
import { AuthController } from './presentation/auth.controller.js';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case.js';
import { DeleteAuthUserUseCase } from './application/use-cases/delete-auth-user.use-case.js';
import { createAuthRouter } from './presentation/auth.router.js';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher.adapter.js';
import { JwtTokenGenerator } from './infrastructure/security/jwt-token.adapter.js';
import { AuthUserModel } from './infrastructure/database/auth-user.model.js';
import { AuthUserReaderAdapter } from './infrastructure/adapters/auth-user-reader.adapter.js';
import { AuthUserWriterAdapter } from './infrastructure/adapters/auth-user-writer.adapter.js';

/**
 * Composes the auth module and returns its Express router and auth service facade.
 *
 * @param {{ logger?: import('../../shared/ports/logger.port.js').LoggerPort }} deps
 * @returns {{ router: import('express').Router, authService: import('./application/auth.facade.js').AuthFacade }}
 */
export const composeAuthModule = ({ logger }) => {
    const tokenGenerator = new JwtTokenGenerator(config.jwt);
    const authUserReader = new AuthUserReaderAdapter({
        authUserModel: AuthUserModel,
    });
    const authUserWriter = new AuthUserWriterAdapter({
        authUserModel: AuthUserModel,
    });

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

    const deleteAuthUserUseCase = new DeleteAuthUserUseCase({
        authUserWriter,
        logger,
    });

    const authController = new AuthController({
        loginUserUseCase,
        logger,
    });

    const router = createAuthRouter({
        authController,
    });

    const authService = new AuthFacade({
        registerUserUseCase,
        deleteAuthUserUseCase,
    });

    return {
        router,
        authService,
    };
};
