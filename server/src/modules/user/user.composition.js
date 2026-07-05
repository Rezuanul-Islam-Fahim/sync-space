import { UserModel } from './infrastructure/database/user.model.js';
import {
    UserReaderRepository,
    UserWriterRepository,
} from './infrastructure/repositories/user.repository.js';
import { ValidateCredentialsUseCase } from './index.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{ passwordHasher: import('../../shared/ports/password-hasher.port.js').PasswordHasherPort }} deps
 * @returns {{
 *   userReader: UserReaderRepository,
 *   userWriter: UserWriterRepository,
 *   validateCredentialsUseCase: ValidateCredentialsUseCase
 * }}
 */
export const composeUserModule = ({ passwordHasher }) => {
    const userReader = new UserReaderRepository(UserModel);
    const userWriter = new UserWriterRepository(UserModel);

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
