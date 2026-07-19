import express from 'express';
import { config } from './config/index.js';
import { createApp } from './app.js';
import {
    composeUserModule,
    UserReaderAdapter,
    UserModel,
    ProfileCreatorAdapter,
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
    composeUserModule({ userReader, logger });

    // ── Auth bounded context ──────────────────────────────────────────────────
    const authUserReader = new AuthUserReaderAdapter({
        authUserModel: AuthUserModel,
    });
    const authUserWriter = new AuthUserWriterAdapter({
        authUserModel: AuthUserModel,
    });

    // Cross-context adapter: satisfies ProfileCreatorPort using UserModel.
    // Only the port interface is imported from auth; the adapter lives in user.
    const profileCreatorPort = new ProfileCreatorAdapter({
        userModel: UserModel,
    });

    const authModule = composeAuthModule({
        authUserReader,
        authUserWriter,
        profileCreatorPort,
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
