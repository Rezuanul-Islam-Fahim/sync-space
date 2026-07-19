import express from 'express';
import { config } from './config/index.js';
import { createApp } from './app.js';
import {
    composeUserModule,
    UserReaderAdapter,
    UserModel,
} from './modules/user/index.js';
import {
    composeAuthModule,
    AuthUserReaderAdapter,
    AuthUserWriterAdapter,
    JwtTokenGenerator,
    JwtTokenVerifier,
} from './modules/auth/index.js';
import { makeAuthenticate } from './shared/middleware/index.js';

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
    const tokenVerifier = new JwtTokenVerifier(config.jwt);

    const userReader = new UserReaderAdapter({ userModel: UserModel });
    const { _getUserUseCase } = composeUserModule({ userReader, logger });

    const authUserReader = new AuthUserReaderAdapter({ userModel: UserModel });
    const authUserWriter = new AuthUserWriterAdapter({ userModel: UserModel });

    const authModule = composeAuthModule({
        authUserReader,
        authUserWriter,
        tokenGenerator,
        logger,
    });

    const _authenticate = makeAuthenticate(userReader, tokenVerifier);

    const v1Router = express.Router();
    v1Router.use('/auth', authModule.router);

    const apiRouter = express.Router();
    apiRouter.use('/v1', v1Router);

    const app = createApp({ router: apiRouter, logger });

    return app;
};
