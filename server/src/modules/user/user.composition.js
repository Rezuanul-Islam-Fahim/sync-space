import { CreateUserUseCase, GetUserUseCase } from './index.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{ userReader: import('./application/ports/user-reader.port.js').UserReaderPort, userWriter: import('./application/ports/user-writer.port.js').UserWriterPort, logger?: import('../../shared/ports/logger.port.js').LoggerPort }} deps
 * @returns {{
 *   createUserUseCase: CreateUserUseCase,
 *   getUserUseCase: GetUserUseCase
 * }}
 */
export const composeUserModule = ({ userReader, userWriter, logger: _logger }) => {

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
