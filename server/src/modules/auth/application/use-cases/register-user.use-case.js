import { AppError, PasswordHasherPort } from '../../../../shared/index.js';
import {
    EMAIL_ALREADY_REGISTERED,
    USERNAME_ALREADY_TAKEN,
    CONFLICT,
} from '../../../../constants/index.js';
import {
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByUsernameUseCase,
} from '../../../user/index.js';

export class RegisterUserUseCase {
    constructor({
        createUserUseCase,
        findUserByEmailUseCase,
        findUserByUsernameUseCase,
        passwordHasher,
        saltRounds,
    }) {
        if (!(createUserUseCase instanceof CreateUserUseCase)) {
            throw new Error(
                'RegisterUserUseCase: createUserUseCase must implement CreateUserUseCase'
            );
        }
        if (!(findUserByEmailUseCase instanceof FindUserByEmailUseCase)) {
            throw new Error(
                'RegisterUserUseCase: findUserByEmailUseCase must implement FindUserByEmailUseCase'
            );
        }
        if (!(findUserByUsernameUseCase instanceof FindUserByUsernameUseCase)) {
            throw new Error(
                'RegisterUserUseCase: findUserByUsernameUseCase must implement FindUserByUsernameUseCase'
            );
        }
        if (!(passwordHasher instanceof PasswordHasherPort)) {
            throw new Error(
                'RegisterUserUseCase: passwordHasher must implement PasswordHasherPort'
            );
        }
        this.createUserUseCase = createUserUseCase;
        this.findUserByEmailUseCase = findUserByEmailUseCase;
        this.findUserByUsernameUseCase = findUserByUsernameUseCase;
        this.passwordHasher = passwordHasher;
        this.saltRounds = saltRounds;
    }

    execute = async data => {
        const existingUserByEmail = await this.findUserByEmailUseCase.execute(
            data.email
        );

        if (existingUserByEmail) {
            throw new AppError(EMAIL_ALREADY_REGISTERED, CONFLICT);
        }

        const existingUserByUsername =
            await this.findUserByUsernameUseCase.execute(data.username);

        if (existingUserByUsername) {
            throw new AppError(USERNAME_ALREADY_TAKEN, CONFLICT);
        }

        const hashedPassword = await this.passwordHasher.hash(
            data.password,
            this.saltRounds
        );

        const newUser = await this.createUserUseCase.execute({
            ...data,
            password: hashedPassword,
        });

        return newUser;
    };
}
