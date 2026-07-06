import {
    UserReaderRepository,
    UserWriterRepository,
} from './infrastructure/repositories/user.repository.js';
import { ValidateCredentialsUseCase } from './index.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{ userModel: import('mongoose').Model, passwordHasher: import('../../shared/ports/password-hasher.port.js').PasswordHasherPort, logger?: import('../../shared/ports/logger.port.js').LoggerPort }} deps
 * @returns {{
 *   userReader: UserReaderRepository,
 *   userWriter: UserWriterRepository,
 *   validateCredentialsUseCase: ValidateCredentialsUseCase
 * }}
 */
export const composeUserModule = ({
    userModel,
    passwordHasher,
    logger: _logger,
}) => {
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
