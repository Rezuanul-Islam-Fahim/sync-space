import { LoginUserUseCase } from './LoginUserUseCase.js';
import { RegisterUserUseCase } from './RegisterUserUseCase.js';

export const makeAuthUseCases = ({
    userRepository,
    passwordHasher,
    tokenService,
}) => ({
    loginUserUseCase: new LoginUserUseCase({
        userRepository,
        passwordHasher,
        tokenService,
    }),
    registerUserUseCase: new RegisterUserUseCase({
        userRepository,
        passwordHasher,
    }),
});
