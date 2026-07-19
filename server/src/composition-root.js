import express from 'express';
import { config } from './config/index.js';
import { createApp } from './app.js';
import {
    composeUserModule,
    UserReaderAdapter,
    UserWriterAdapter,
    UserModel,
} from './modules/user/index.js';
import {
    composeAuthModule,
    AuthUserModel,
    AuthUserReaderAdapter,
    AuthUserWriterAdapter,
} from './modules/auth/index.js';
import { JwtTokenGenerator } from './modules/auth/infrastructure/security/jwt-token.adapter.js';

/**
 * Wires all dependencies and returns the composed Express app.
 *
 * logger is required — callers must pass a fully-initialised LoggerPort
 * instance (typically created from the Joi-validated config.logLevel in
 * server.js).  No concrete logger is imported here to keep this file
 * infrastructure-agnostic and testable.
 *
 * @param {{ logger: import('./shared/ports/logger.port.js').LoggerPort }} deps
 */
export const composeDependencies = ({ logger }) => {
    const tokenGenerator = new JwtTokenGenerator(config.jwt);

    // ── User bounded context ──────────────────────────────────────────────────
    const userReader = new UserReaderAdapter({ userModel: UserModel });
    const userWriter = new UserWriterAdapter({ userModel: UserModel });
    const userModule = composeUserModule({ userReader, userWriter, logger });

    // ── Auth bounded context ──────────────────────────────────────────────────
    const authUserReader = new AuthUserReaderAdapter({
        authUserModel: AuthUserModel,
    });
    const authUserWriter = new AuthUserWriterAdapter({
        authUserModel: AuthUserModel,
    });

    const authModule = composeAuthModule({
        authUserReader,
        authUserWriter,
        createUserUseCase: userModule.createUserUseCase,
        tokenGenerator,
        logger,
    });

    // ── Middleware ────────────────────────────────────────────────────────────

    // ── Routing ───────────────────────────────────────────────────────────────
    const v1Router = express.Router();
    v1Router.use('/auth', authModule.router);

    const apiRouter = express.Router();
    apiRouter.use('/v1', v1Router);

    const app = createApp({ router: apiRouter, logger });

    return app;
};
