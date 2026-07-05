import express from 'express';
import config from './config/index.js';
import createApp from './app.js';

// ── Infrastructure ────────────────────────────────────────────────────────────
import { UserModel } from './modules/user/infrastructure/database/user.model.js';
import UserRepository from './modules/user/infrastructure/repositories/user.repository.js';
import { UserService } from './modules/user/application/services/user.service.js';
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
    const userRepository = new UserRepository(UserModel);
    const passwordHasher = new BcryptPasswordHasher();
    const tokenService = new JwtTokenService(config.jwt);
    const saltRounds = config.auth.saltRounds;

    // 1.5. Application services
    const userService = new UserService(userRepository);

    // 2. Shared infrastructure bundle passed into every module
    const infra = { userService, passwordHasher, tokenService, saltRounds };

    // 3. Module composition — each module wires its internals
    const authModule = createAuthModule(infra);

    // 4. Shared middlewares that cross module boundaries
    const authenticate = makeAuthenticate(userService, tokenService);

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
