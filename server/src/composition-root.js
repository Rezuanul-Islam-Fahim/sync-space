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
import { AuthUserModel } from './modules/auth/infrastructure/database/auth-user.model.js';
import {
    BcryptPasswordHasher,
    JwtTokenGenerator,
    JwtTokenVerifier,
} from './shared/infrastructure/security/index.js';

// ── Shared middleware ─────────────────────────────────────────────────────────
import { makeAuthenticate } from './shared/index.js';
import { logger as defaultLogger } from './shared/infrastructure/logging/winston-logger.adapter.js';

export const composeDependencies = ({ logger = defaultLogger } = {}) => {
    // 1. Shared Infrastructure/Outbound adapters
    const passwordHasher = new BcryptPasswordHasher({
        saltRounds: config.auth.saltRounds,
    });
    const tokenGenerator = new JwtTokenGenerator(config.jwt);
    const tokenVerifier = new JwtTokenVerifier(config.jwt);

    // 2. Module Composition
    const userReader = new UserReaderAdapter({ userModel: UserModel });
    composeUserModule({
        userReader,
        logger,
    });

    const authUserReader = new AuthUserReaderAdapter({
        userModel: AuthUserModel,
    });
    const authUserWriter = new AuthUserWriterAdapter({
        userModel: AuthUserModel,
    });

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

    return { app, authenticate };
};
