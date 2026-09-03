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
import { SessionWriterAdapter } from './infrastructure/cache/session-writer.adapter.js';
import { SessionReaderAdapter } from './infrastructure/cache/session-reader.adapter.js';
import { TokenRefreshUseCase } from './application/use-cases/token-refresh.usecase.js';
import { LogoutUseCase } from './application/use-cases/logout.usecase.js';
import { GetBlacklistedLoginUseCase } from './application/use-cases/get-blacklisted-login.usecase.js';
import { makeAuthenticate } from './presentation/auth.middleware.js';

/**
 * Composes the auth module and returns its Express router and auth service facade.
 *
 * @param {{
 *   logger?: import('../../shared/ports/index.js').LoggerPort,
 *   authConfig: { saltRounds: number },
 *   jwtConfig: { algorithm?: string, secret: string, expiresIn: string, refreshSecret: string, refreshExpiresIn: string },
 *   dbConnection?: import('mongoose').Connection,
 *   autoIndex?: boolean,
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
    redisClient,
    autoIndex,
    authUserModel = dbConnection
        ? getAuthUserModel(dbConnection, { autoIndex })
        : null,
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

    const sessionWriter = new SessionWriterAdapter({
        client: redisClient,
        logger,
    });
    const sessionReader = new SessionReaderAdapter({
        client: redisClient,
        logger,
    });

    const loginUserUseCase = new LoginUserUseCase({
        authUserReader,
        passwordComparer,
        tokenGenerator,
        sessionWriter,
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

    const getBlacklistedLoginUseCase = new GetBlacklistedLoginUseCase({
        sessionReader,
    });

    const tokenRefreshUseCase = new TokenRefreshUseCase({
        tokenGenerator,
        tokenVerifier,
        sessionReader,
        sessionWriter,
        logger,
    });

    const logoutUseCase = new LogoutUseCase({
        tokenVerifier,
        sessionReader,
        sessionWriter,
        logger,
    });

    const authService = new AuthFacade({
        registerUserUseCase,
        deleteAuthUserUseCase,
    });

    const authController = new AuthController({
        loginUserUseCase,
        tokenRefreshUseCase,
        logoutUseCase,
        logger,
    });

    const authenticate = makeAuthenticate({
        verifyAccessTokenUseCase,
        getBlacklistedLoginUseCase,
    });

    const router = createAuthRouter({
        authController,
        authenticate,
    });

    return {
        router,
        authService,
        authenticate,
    };
};
