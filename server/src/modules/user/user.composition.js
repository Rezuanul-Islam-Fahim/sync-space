import { UserFacade } from './application/user.facade.js';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase.js';
import { getUserModel } from './infrastructure/database/user.model.js';
import { UserWriterAdapter } from './infrastructure/adapters/user-writer.adapter.js';
import { UserReaderAdapter } from './infrastructure/adapters/user-reader.adapter.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{
 *   logger?: import('../../shared/ports/index.js').LoggerPort,
 *   connection?: import('mongoose').Connection,
 *   userModel?: any
 * }} deps
 * @returns {{
 *   router: import('express').Router | null,
 *   userService: import('./application/user.facade.js').UserFacade
 * }}
 */
export const composeUserModule = ({
    logger,
    connection,
    userModel = connection ? getUserModel(connection) : null,
}) => {
    if (!userModel) {
        throw new Error(
            'Either a database connection or userModel must be provided to composeUserModule.'
        );
    }
    const userWriter = new UserWriterAdapter({ userModel });
    const userReader = new UserReaderAdapter({ userModel });

    const createUserUseCase = new CreateUserUseCase({
        userWriter,
        logger,
    });

    const userService = new UserFacade({
        createUserUseCase,
        userReader,
    });

    return {
        router: null,
        userService,
    };
};
