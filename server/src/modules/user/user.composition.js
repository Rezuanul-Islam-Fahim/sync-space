import { GetUserUseCase } from './application/use-cases/get-user.use-case.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{ userReader: import('./application/ports/user-reader.port.js').UserReaderPort, logger?: import('../../shared/ports/logger.port.js').LoggerPort }} deps
 * @returns {{
 *   getUserUseCase: GetUserUseCase
 * }}
 */
export const composeUserModule = ({ userReader, logger }) => {
    const getUserUseCase = new GetUserUseCase({
        userReader,
        logger,
    });

    return {
        getUserUseCase,
    };
};
