import { LoginUserUseCase } from './login-user.usecase.js';
import { RegisterUserUseCase } from './register-user.usecase.js';

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
