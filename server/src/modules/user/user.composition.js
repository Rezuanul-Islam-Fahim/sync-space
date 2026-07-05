import {
    UserModel,
    UserRepository,
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
    FindUserByUsernameUseCase,
    ValidateCredentialsUseCase,
    UserAuthAdapter,
} from './index.js';

/**
 * Composes the user module's dependencies.
 *
 * @param {{ passwordHasher: import('../../shared/ports/password-hasher.port.js').PasswordHasherPort }} deps
 * @returns {{ findUserByIdUseCase: FindUserByIdUseCase, authUserProvider: UserAuthAdapter }}
 */
export const composeUserModule = ({ passwordHasher }) => {
    const userRepository = new UserRepository(UserModel);

    const createUserUseCase = new CreateUserUseCase({ userRepository });
    const findUserByEmailUseCase = new FindUserByEmailUseCase({
        userRepository,
    });
    const findUserByIdUseCase = new FindUserByIdUseCase({ userRepository });
    const findUserByUsernameUseCase = new FindUserByUsernameUseCase({
        userRepository,
    });
    const validateCredentialsUseCase = new ValidateCredentialsUseCase({
        userRepository,
        passwordHasher,
    });

    const authUserProvider = new UserAuthAdapter({
        createUserUseCase,
        findUserByEmailUseCase,
        findUserByUsernameUseCase,
        validateCredentialsUseCase,
    });

    return {
        findUserByIdUseCase,
        authUserProvider,
    };
};
