import { userRepository } from '../../user/index.js';
import { LoginUserUseCase } from './LoginUserUseCase.js';
import { RegisterUserUseCase } from './RegisterUserUseCase.js';

export const loginUserUseCase = new LoginUserUseCase({ userRepository });

export const registerUserUseCase = new RegisterUserUseCase({ userRepository });
