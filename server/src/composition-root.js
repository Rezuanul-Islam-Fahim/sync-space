import express from 'express';
import config from './config/index.js';
import createApp from './app.js';

import { UserModel } from './infrastructure/database/models/user.model.js';
import { MongoUserRepository } from './infrastructure/repositories/index.js';
import {
    BcryptPasswordHasher,
    JwtTokenService,
} from './infrastructure/security/index.js';
import { makeAuthenticate } from './common/middlewares/auth.middleware.js';

// Auth Module
import {
    AuthController,
    LoginUserUseCase,
    RegisterUserUseCase,
    createAuthRouter,
} from './modules/auth/index.js';

export const composeDependencies = () => {
    // 1. Instantiating Outbound Adapters
    const userRepository = new MongoUserRepository(UserModel);
    const passwordHasher = new BcryptPasswordHasher();
    const tokenService = new JwtTokenService(config.jwt);
    const saltRounds = config.auth.saltRounds;

    // 2. Instantiating Use Cases (injecting adapters through ports)
    const loginUserUseCase = new LoginUserUseCase({
        userRepository,
        passwordHasher,
        tokenService,
    });
    const registerUserUseCase = new RegisterUserUseCase({
        userRepository,
        passwordHasher,
        saltRounds,
    });

    // 3. Instantiating Controllers (Inbound Adapters)
    const authController = new AuthController({
        loginUserUseCase,
        registerUserUseCase,
    });

    // 4. Instantiating Middlewares
    const authenticate = makeAuthenticate(userRepository, tokenService);

    // 5. Explicit Route Wiring (Composition Root)
    const authRouter = createAuthRouter(authController);

    const apiRouter = express.Router();
    apiRouter.use('/auth', authRouter);

    // 6. Instantiating Express App
    const app = createApp({ router: apiRouter });

    return {
        app,
        authenticate,
    };
};
