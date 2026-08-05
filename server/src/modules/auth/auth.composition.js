// config is injected by the composition root to avoid hidden globals
import { AuthFacade } from './application/auth.facade.js';
import { AuthController } from './presentation/auth.controller.js';
import { LoginUserUseCase } from './application/use-cases/login-user.usecase.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.usecase.js';
import { DeleteAuthUserUseCase } from './application/use-cases/delete-auth-user.usecase.js';
import { createAuthRouter } from './presentation/auth.router.js';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher.adapter.js';
import {
    JwtTokenGenerator,
    JwtTokenVerifier,
} from './infrastructure/security/jwt-token.adapter.js';
import { AuthUserModel } from './infrastructure/database/auth-user.model.js';
import { AuthUserReaderAdapter } from './infrastructure/adapters/auth-user-reader.adapter.js';
import { AuthUserWriterAdapter } from './infrastructure/adapters/auth-user-writer.adapter.js';

/**
 * Composes the auth module and returns its Express router and auth service facade.
 *
 * @param {{
 *   logger?: import('../../shared/ports/index.js').LoggerPort,
 *   authConfig: { saltRounds: number },
 *   jwtConfig: { secret: string, expiresIn: string, refreshSecret: string, refreshExpiresIn: string },
 *   authUserModel?: any
 * }} deps
 * @returns {{
 *   router: import('express').Router,
 *   authService: import('./application/auth.facade.js').AuthFacade
 * }}
 */
export const composeAuthModule = ({
    logger,
    authConfig,
    jwtConfig,
    authUserModel = AuthUserModel,
}) => {
    const tokenGenerator = new JwtTokenGenerator(jwtConfig);
    const tokenVerifier = new JwtTokenVerifier(jwtConfig);
    const authUserReader = new AuthUserReaderAdapter({
        authUserModel,
    });
    const authUserWriter = new AuthUserWriterAdapter({
        authUserModel,
    });

    const passwordHasher = new BcryptPasswordHasher({
        saltRounds: authConfig.saltRounds,
    });

    const loginUserUseCase = new LoginUserUseCase({
        authUserReader,
        passwordHasher,
        tokenGenerator,
        logger,
    });

    const registerUserUseCase = new RegisterUserUseCase({
        authUserWriter,
        passwordHasher,
        logger,
    });

    const deleteAuthUserUseCase = new DeleteAuthUserUseCase({
        authUserWriter,
        logger,
    });

    const authService = new AuthFacade({
        loginUserUseCase,
        registerUserUseCase,
        deleteAuthUserUseCase,
        tokenVerifier,
    });

    const authController = new AuthController({
        authService,
        logger,
    });

    const router = createAuthRouter({
        authController,
    });

    return {
        router,
        authService,
    };
};
