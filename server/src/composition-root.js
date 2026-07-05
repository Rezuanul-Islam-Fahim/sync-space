import express from 'express';
import config from './config/index.js';
import createApp from './app.js';

// ── Infrastructure & Modules ──────────────────────────────────────────────────
import { composeUserModule } from './modules/user/index.js';
import { createAuthModule } from './modules/auth/index.js';
import {
    BcryptPasswordHasher,
    JwtTokenService,
} from './shared/infrastructure/security/index.js';

// ── Shared middlewares ────────────────────────────────────────────────────────
import { makeAuthenticate } from './shared/index.js';

export const composeDependencies = ({ logger }) => {
    // 1. Shared Infrastructure/Outbound adapters
    const passwordHasher = new BcryptPasswordHasher();
    const tokenService = new JwtTokenService(config.jwt);
    const saltRounds = config.auth.saltRounds;

    // 2. Module Composition
    const { findUserByIdUseCase, authUserProvider } = composeUserModule({
        passwordHasher,
    });

    const authModule = createAuthModule({
        authUserProvider,
        passwordHasher,
        tokenService,
        saltRounds,
    });

    // 3. Shared middlewares
    const authenticate = makeAuthenticate(findUserByIdUseCase, tokenService);

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
