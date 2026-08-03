import { UserFacade } from './application/user.facade.js';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase.js';
import { UserModel } from './infrastructure/database/user.model.js';
import { UserWriterAdapter } from './infrastructure/adapters/user-writer.adapter.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{ logger?: import('../../shared/ports/index.js').LoggerPort }} deps
 * @returns {{
 *   userService: import('./application/user.facade.js').UserFacade
 * }}
 */
export const composeUserModule = ({ logger }) => {
    const userWriter = new UserWriterAdapter({ userModel: UserModel });
    const createUserUseCase = new CreateUserUseCase({
        userWriter,
        logger,
    });

    const userService = new UserFacade({
        createUserUseCase,
    });

    return {
        userService,
    };
};
