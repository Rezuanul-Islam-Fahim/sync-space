import { LoginUserUseCase } from './login-user.use-case.js';
import { RegisterUserUseCase } from './register-user.use-case.js';

export const makeAuthUseCases = ({
    userRepository,
    passwordHasher,
    tokenService,
    saltRounds,
}) => ({
    loginUserUseCase: new LoginUserUseCase({
        userRepository,
        passwordHasher,
        tokenService,
    }),
    registerUserUseCase: new RegisterUserUseCase({
        userRepository,
        passwordHasher,
        saltRounds,
    }),
});
