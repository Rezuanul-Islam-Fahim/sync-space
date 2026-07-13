import express from 'express';
import { config } from './config/index.js';
import { createApp } from './app.js';

// ── Infrastructure & Modules ──────────────────────────────────────────────────
import { composeUserModule } from './modules/user/index.js';
import { UserReaderAdapter } from './modules/user/infrastructure/adapters/user-reader.adapter.js';
import { UserModel } from './modules/user/infrastructure/database/user.model.js';
import { composeAuthModule } from './modules/auth/index.js';
import {
    AuthUserReaderAdapter,
    AuthUserWriterAdapter,
} from './modules/auth/infrastructure/index.js';
import {
    BcryptPasswordHasher,
    JwtTokenGenerator,
    JwtTokenVerifier,
} from './shared/infrastructure/security/index.js';

// ── Shared middleware ─────────────────────────────────────────────────────────
import { makeAuthenticate } from './shared/index.js';

/**
 * Wires all dependencies and returns the composed Express app.
 *
 * `logger` is required — callers must pass a fully-initialised LoggerPort
 * instance (typically created from the Joi-validated config.logLevel in
 * server.js).  No concrete logger is imported here to keep this file
 * infrastructure-agnostic and testable (Issue 17).
 *
 * @param {{ logger: import('./shared/ports/logger.port.js').LoggerPort }} deps
 */
export const composeDependencies = ({ logger }) => {
    // 1. Shared Infrastructure/Outbound adapters
    const passwordHasher = new BcryptPasswordHasher({
        saltRounds: config.auth.saltRounds,
    });
    const tokenGenerator = new JwtTokenGenerator(config.jwt);
    const tokenVerifier = new JwtTokenVerifier(config.jwt);

    // 2. Module Composition
    // All adapters receive the same unified UserModel — single schema, single
    // collection.  AuthUserReaderAdapter reads WITH password (auth flows);
    // UserReaderAdapter always strips it via .select('-password') (Issue 1).
    const userReader = new UserReaderAdapter({ userModel: UserModel });
    const { getUserUseCase } = composeUserModule({ userReader, logger }); // Result captured (Issue 3)

    const authUserReader = new AuthUserReaderAdapter({ userModel: UserModel });
    const authUserWriter = new AuthUserWriterAdapter({ userModel: UserModel });

    const authModule = composeAuthModule({
        authUserReader,
        authUserWriter,
        passwordHasher,
        tokenGenerator,
        logger,
    });

    // 3. Shared middleware
    const authenticate = makeAuthenticate(userReader, tokenVerifier);

    // 4. Route wiring — all routes versioned under /api/v1
    const v1Router = express.Router();
    v1Router.use('/auth', authModule.router);
    // Future modules: v1Router.use('/users', userModule.router);

    const apiRouter = express.Router();
    apiRouter.use('/v1', v1Router);

    // 5. Express app
    const app = createApp({ router: apiRouter, logger });

    return { app, authenticate, getUserUseCase };
};
