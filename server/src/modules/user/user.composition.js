import {
    UserReaderRepository,
    UserWriterRepository,
} from './infrastructure/repositories/user.repository.js';
import { UserModel } from './infrastructure/database/user.model.js';
import { CreateUserUseCase } from './index.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{ passwordHasher: import('../../shared/ports/password-hasher.port.js').PasswordHasherPort, logger?: import('../../shared/ports/logger.port.js').LoggerPort }} deps
 * @returns {{
 *   userReader: UserReaderRepository,
 *   userWriter: UserWriterRepository,
 *   createUserUseCase: CreateUserUseCase
 * }}
 */
export const composeUserModule = ({ passwordHasher, logger: _logger }) => {
    const userReader = new UserReaderRepository(UserModel);
    const userWriter = new UserWriterRepository(UserModel);

    const createUserUseCase = new CreateUserUseCase({
        userReader,
        userWriter,
        passwordHasher,
    });

    return {
        userReader,
        userWriter,
        createUserUseCase,
    };
};
