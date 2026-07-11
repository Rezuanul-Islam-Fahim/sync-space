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
export const composeUserModule = ({ userReader, userWriter, logger }) => {
    const createUserUseCase = new CreateUserUseCase({
        userReader,
        userWriter,
        logger,
    });

    const getUserUseCase = new GetUserUseCase({
        userReader,
        logger,
    });

    return {
        createUserUseCase,
        getUserUseCase,
    };
};
