import { UserFacade } from './application/user.facade.js';
import { GetUserUseCase } from './application/use-cases/get-user.usecase.js';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase.js';
import { UserModel } from './infrastructure/database/user.model.js';
import { UserReaderAdapter } from './infrastructure/adapters/user-reader.adapter.js';
import { UserWriterAdapter } from './infrastructure/adapters/user-writer.adapter.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{ logger?: import('../../shared/ports/logger.port.js').LoggerPort }} deps
 * @returns {{
 *   userService: import('./application/user.facade.js').UserFacade
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

    const userService = new UserFacade({
        getUserUseCase,
        createUserUseCase,
    });

    return {
        userService,
    };
};
