import { UserModel } from './infrastructure/database/user.model.js';
import UserRepository from './infrastructure/repositories/user.repository.js';
import {
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
    FindUserByUsernameUseCase,
    ValidateCredentialsUseCase,
} from './index.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{ passwordHasher: import('../../shared/ports/password-hasher.port.js').PasswordHasherPort }} deps
 * @returns {{
 *   findUserByIdUseCase: FindUserByIdUseCase,
 *   createUserUseCase: CreateUserUseCase,
 *   findUserByEmailUseCase: FindUserByEmailUseCase,
 *   findUserByUsernameUseCase: FindUserByUsernameUseCase,
 *   validateCredentialsUseCase: ValidateCredentialsUseCase
 * }}
 */
export const composeUserModule = ({ passwordHasher }) => {
    const userRepository = new UserRepository(UserModel);

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

    return {
        createUserUseCase,
        findUserByEmailUseCase,
        findUserByIdUseCase,
        findUserByUsernameUseCase,
        validateCredentialsUseCase,
    };
};
