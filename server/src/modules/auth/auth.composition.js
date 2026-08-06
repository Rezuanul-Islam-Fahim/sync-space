// config is injected by the composition root to avoid hidden globals
import { AuthFacade } from './application/auth.facade.js';
import { AuthController } from './presentation/auth.controller.js';
import { LoginUserUseCase } from './application/use-cases/login-user.usecase.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.usecase.js';
import { DeleteAuthUserUseCase } from './application/use-cases/delete-auth-user.usecase.js';
import { VerifyAccessTokenUseCase } from './application/use-cases/verify-access-token.usecase.js';
import { createAuthRouter } from './presentation/auth.router.js';
import {
    BcryptPasswordHasher,
    BcryptPasswordComparer,
} from './infrastructure/security/bcrypt-password-hasher.adapter.js';
import {
    JwtTokenGenerator,
    JwtTokenVerifier,
} from './infrastructure/security/jwt-token.adapter.js';
import { getAuthUserModel } from './infrastructure/database/auth-user.model.js';
import { AuthUserReaderAdapter } from './infrastructure/adapters/auth-user-reader.adapter.js';
import { AuthUserWriterAdapter } from './infrastructure/adapters/auth-user-writer.adapter.js';

/**
 * Composes the auth module and returns its Express router and auth service facade.
 *
 * @param {{
 *   logger?: import('../../shared/ports/index.js').LoggerPort,
 *   authConfig: { saltRounds: number },
 *   jwtConfig: { algorithm?: string, secret: string, expiresIn: string, refreshSecret: string, refreshExpiresIn: string },
 *   dbConnection?: import('mongoose').Connection,
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
    dbConnection,
    authUserModel = dbConnection ? getAuthUserModel(dbConnection) : null,
}) => {
    if (!authUserModel) {
        throw new Error(
            'Either dbConnection or authUserModel must be provided to composeAuthModule.'
        );
    }
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
    const passwordComparer = new BcryptPasswordComparer();

    const loginUserUseCase = new LoginUserUseCase({
        authUserReader,
        passwordComparer,
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

    const verifyAccessTokenUseCase = new VerifyAccessTokenUseCase({
        tokenVerifier,
        logger,
    });

    const authService = new AuthFacade({
        loginUserUseCase,
        registerUserUseCase,
        deleteAuthUserUseCase,
        verifyAccessTokenUseCase,
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
