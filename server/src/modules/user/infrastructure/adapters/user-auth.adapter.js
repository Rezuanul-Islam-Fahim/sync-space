import { AuthUserProviderPort } from '../../../auth/application/ports/auth-user-provider.port.js';

export class UserAuthAdapter extends AuthUserProviderPort {
    constructor({
        createUserUseCase,
        findUserByEmailUseCase,
        findUserByUsernameUseCase,
        validateCredentialsUseCase,
    }) {
        super();
        this.createUserUseCase = createUserUseCase;
        this.findUserByEmailUseCase = findUserByEmailUseCase;
        this.findUserByUsernameUseCase = findUserByUsernameUseCase;
        this.validateCredentialsUseCase = validateCredentialsUseCase;
    }

    createUser = async userData => {
        return this.createUserUseCase.execute(userData);
    };

    findByEmail = async email => {
        return this.findUserByEmailUseCase.execute(email);
    };

    findByUsername = async username => {
        return this.findUserByUsernameUseCase.execute(username);
    };

    validateCredentials = async (email, password) => {
        return this.validateCredentialsUseCase.execute({ email, password });
    };
}
