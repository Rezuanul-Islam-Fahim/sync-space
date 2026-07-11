import {
    UserReaderRepository,
    UserWriterRepository,
} from './infrastructure/repositories/user.repository.js';
import { UserModel } from './infrastructure/database/user.model.js';
import { CreateUserUseCase, GetUserUseCase } from './index.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{ logger?: import('../../shared/ports/logger.port.js').LoggerPort }} deps
 * @returns {{
 *   createUserUseCase: CreateUserUseCase,
 *   getUserUseCase: GetUserUseCase
 * }}
 */
export const composeUserModule = ({ logger: _logger }) => {
    const userReader = new UserReaderRepository(UserModel);
    const userWriter = new UserWriterRepository(UserModel);

    const createUserUseCase = new CreateUserUseCase({
        userReader,
        userWriter,
    });

    const getUserUseCase = new GetUserUseCase({
        userReader,
    });

    return {
        createUserUseCase,
        getUserUseCase,
    };
};
