import express from 'express';
import config from './config/index.js';
import createApp from './app.js';

// ── Infrastructure & Modules ──────────────────────────────────────────────────
import { composeUserModule } from './modules/user/index.js';
import { UserModel } from './modules/user/infrastructure/database/user.model.js';
import { composeAuthModule } from './modules/auth/index.js';
import {
    UserReaderAdapter,
    UserWriterAdapter,
} from './modules/auth/infrastructure/adapters/user-provider.adapter.js';
import {
    BcryptPasswordHasher,
    JwtTokenGenerator,
    JwtTokenVerifier,
} from './shared/infrastructure/security/index.js';

// ── Shared middleware ─────────────────────────────────────────────────────────
import { makeAuthenticate } from './shared/index.js';

export const composeDependencies = ({ logger }) => {
    // 1. Shared Infrastructure/Outbound adapters
    const passwordHasher = new BcryptPasswordHasher({
        saltRounds: config.auth.saltRounds,
    });
    const tokenGenerator = new JwtTokenGenerator(config.jwt);
    const tokenVerifier = new JwtTokenVerifier(config.jwt);

    // 2. Module Composition
    const { userReader, userWriter } = composeUserModule({
        userModel: UserModel,
        passwordHasher,
    });

    const authUserReader = new UserReaderAdapter({ userReader });
    const authUserWriter = new UserWriterAdapter({ userWriter });

    const authModule = composeAuthModule({
        authUserReader,
        authUserWriter,
        passwordHasher,
        tokenGenerator,
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
