import { UserModel } from './infrastructure/database/user.model.js';
import UserRepository from './infrastructure/repositories/user.repository.js';
import { ValidateCredentialsUseCase } from './index.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{ passwordHasher: import('../../shared/ports/password-hasher.port.js').PasswordHasherPort }} deps
 * @returns {{
 *   userRepository: UserRepository,
 *   validateCredentialsUseCase: ValidateCredentialsUseCase
 * }}
 */
export const composeUserModule = ({ passwordHasher }) => {
    const userRepository = new UserRepository(UserModel);

    const validateCredentialsUseCase = new ValidateCredentialsUseCase({
        userRepository,
        passwordHasher,
    });

    return {
        userRepository,
        validateCredentialsUseCase,
    };
};
