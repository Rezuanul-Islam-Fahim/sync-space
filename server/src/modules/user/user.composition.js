import {
    UserReaderRepository,
    UserWriterRepository,
} from './infrastructure/repositories/user.repository.js';
import { ValidateCredentialsUseCase } from './index.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{ userModel: import('mongoose').Model, passwordHasher: import('../../shared/ports/password-hasher.port.js').PasswordHasherPort }} deps
 * @returns {{
 *   userReader: UserReaderRepository,
 *   userWriter: UserWriterRepository,
 *   validateCredentialsUseCase: ValidateCredentialsUseCase
 * }}
 */
export const composeUserModule = ({ userModel, passwordHasher }) => {
    if (!userModel) {
        throw new Error('composeUserModule: userModel is required');
    }

    const userReader = new UserReaderRepository(userModel);
    const userWriter = new UserWriterRepository(userModel);

    const validateCredentialsUseCase = new ValidateCredentialsUseCase({
        userReader,
        passwordHasher,
    });

    return {
        userReader,
        userWriter,
        validateCredentialsUseCase,
    };
};
