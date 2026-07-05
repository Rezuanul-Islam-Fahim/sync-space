import express from 'express';
import config from './config/index.js';
import createApp from './app.js';

// ── Infrastructure ────────────────────────────────────────────────────────────
import {
    UserModel,
    UserRepository,
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
    FindUserByUsernameUseCase,
    ValidateCredentialsUseCase,
} from './modules/user/index.js';
import {
    BcryptPasswordHasher,
    JwtTokenService,
} from './shared/infrastructure/security/index.js';

// ── Shared middlewares ────────────────────────────────────────────────────────
import { makeAuthenticate } from './shared/index.js';

// ── Module factories ──────────────────────────────────────────────────────────
import { createAuthModule } from './modules/auth/index.js';

export const composeDependencies = ({ logger }) => {
    // 1. Outbound adapters (infrastructure implementations)
    const userRepository = new UserRepository(UserModel);
    const passwordHasher = new BcryptPasswordHasher();
    const tokenService = new JwtTokenService(config.jwt);
    const saltRounds = config.auth.saltRounds;

    // 1.5. Application use cases
    const createUserUseCase = new CreateUserUseCase({ userRepository });
    const findUserByEmailUseCase = new FindUserByEmailUseCase({
        userRepository,
    });
    const findUserByIdUseCase = new FindUserByIdUseCase({ userRepository });
    const findUserByUsernameUseCase = new FindUserByUsernameUseCase({
        userRepository,
    });
    const validateCredentialsUseCase = new ValidateCredentialsUseCase({
        userRepository,
        passwordHasher,
    });

    // 2. Shared infrastructure bundle passed into every module
    const infra = {
        createUserUseCase,
        findUserByEmailUseCase,
        findUserByIdUseCase,
        findUserByUsernameUseCase,
        validateCredentialsUseCase,
        passwordHasher,
        tokenService,
        saltRounds,
    };

    // 3. Module composition — each module wires its internals
    const authModule = createAuthModule(infra);

    // 4. Shared middlewares that cross module boundaries
    const authenticate = makeAuthenticate(findUserByIdUseCase, tokenService);

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
