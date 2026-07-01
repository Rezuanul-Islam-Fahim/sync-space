import { userRepo } from '../../user/index.js';
import { LoginUserUseCase } from './LoginUserUseCase.js';
import { RegisterUserUseCase } from './RegisterUserUseCase.js';

export const loginUserUseCase = new LoginUserUseCase({
    userRepository: userRepo,
});

export const registerUserUseCase = new RegisterUserUseCase({
    userRepository: userRepo,
});
