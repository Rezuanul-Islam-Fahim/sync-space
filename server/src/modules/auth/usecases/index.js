import { LoginUserUseCase } from './LoginUserUseCase.js';
import { RegisterUserUseCase } from './RegisterUserUseCase.js';

export const makeAuthUseCases = ({ userRepository }) => ({
    loginUserUseCase: new LoginUserUseCase({ userRepository }),
    registerUserUseCase: new RegisterUserUseCase({ userRepository }),
});
