import express from 'express';
import config from './config/index.js';
import createApp from './app.js';

// ── Infrastructure ────────────────────────────────────────────────────────────
import { UserModel } from './infrastructure/database/models/user.model.js';
import { MongoUserRepository } from './infrastructure/repositories/index.js';
import {
    BcryptPasswordHasher,
    JwtTokenService,
} from './infrastructure/security/index.js';

// ── Shared middlewares ────────────────────────────────────────────────────────
import { makeAuthenticate } from './shared/middlewares/auth.middleware.js';

// ── Module factories ──────────────────────────────────────────────────────────
import { createAuthModule } from './modules/auth/index.js';

export const composeDependencies = ({ logger }) => {
    // 1. Outbound adapters (infrastructure implementations)
    const userRepository = new MongoUserRepository(UserModel);
    const passwordHasher = new BcryptPasswordHasher();
    const tokenService = new JwtTokenService(config.jwt);
    const saltRounds = config.auth.saltRounds;

    // 2. Shared infrastructure bundle passed into every module
    const infra = { userRepository, passwordHasher, tokenService, saltRounds };

    // 3. Module composition — each module wires its own internals
    const authModule = createAuthModule(infra);

    // 4. Shared middlewares that cross module boundaries
    const authenticate = makeAuthenticate(userRepository, tokenService);

    // 5. Route wiring — all routes versioned under /api/v1
    const v1Router = express.Router();
    v1Router.use('/auth', authModule.router);
    // Future modules: v1Router.use('/users', userModule.router);

    const apiRouter = express.Router();
    apiRouter.use('/v1', v1Router);

    // 6. Express app
    const app = createApp({ router: apiRouter, logger });

    return { app, authenticate };
};
