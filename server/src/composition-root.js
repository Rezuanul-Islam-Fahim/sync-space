import express from 'express';
import config from './config/index.js';
import createApp from './app.js';

// Infrastructure & Adapters
import { UserModel } from './modules/user/index.js';
import UserRepository from './modules/user/user.repository.js';
import BcryptPasswordHasher from './infrastructure/security/bcrypt-password-hasher.service.js';
import JwtTokenService from './infrastructure/security/jwt-token.service.js';
import { makeAuthenticate } from './middlewares/auth.middleware.js';

// Auth Module
import {
    AuthController,
    LoginUserUseCase,
    RegisterUserUseCase,
    loginValidation,
    registerValidation,
} from './modules/auth/index.js';
import validate from './middlewares/validate.middleware.js';

export const composeDependencies = () => {
    // 1. Instantiating Outbound Adapters
    const userRepository = new UserRepository(UserModel);
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
    const authRouter = express.Router();
    authRouter.post(
        '/register',
        registerValidation,
        validate,
        authController.register
    );
    authRouter.post('/login', loginValidation, validate, authController.login);

    const apiRouter = express.Router();
    apiRouter.use('/auth', authRouter);

    // 6. Instantiating Express App
    const app = createApp({ router: apiRouter });

    return {
        app,
        authenticate,
    };
};
