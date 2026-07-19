import { GetUserUseCase } from './application/use-cases/get-user.use-case.js';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case.js';
import { UserModel } from './infrastructure/database/user.model.js';
import { UserReaderAdapter } from './infrastructure/adapters/user-reader.adapter.js';
import { UserWriterAdapter } from './infrastructure/adapters/user-writer.adapter.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{ userReader: import('./application/ports/user-reader.port.js').UserReaderPort, userWriter: import('./application/ports/user-writer.port.js').UserWriterPort, logger?: import('../../shared/ports/logger.port.js').LoggerPort }} deps
 * @returns {{
 *   getUserUseCase: GetUserUseCase,
 *   createUserUseCase: CreateUserUseCase
 * }}
 */
export const composeUserModule = ({ logger }) => {
    const userReader = new UserReaderAdapter({ userModel: UserModel });
    const userWriter = new UserWriterAdapter({ userModel: UserModel });
    const getUserUseCase = new GetUserUseCase({
        userReader,
        logger,
    });

    const createUserUseCase = new CreateUserUseCase({
        userWriter,
        logger,
    });

    return {
        getUserUseCase,
        createUserUseCase,
    };
};
