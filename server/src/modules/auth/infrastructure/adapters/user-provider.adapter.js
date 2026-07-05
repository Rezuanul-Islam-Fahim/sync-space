import { AuthUserProviderPort } from '../../application/ports/auth-user-provider.port.js';

export class UserProviderAdapter extends AuthUserProviderPort {
    constructor({ userRepository, validateCredentialsUseCase }) {
        super();
        this.userRepository = userRepository;
        this.validateCredentialsUseCase = validateCredentialsUseCase;
    }

    createUser = async userData => {
        return this.userRepository.createUser(userData);
    };

    findByEmail = async email => {
        return this.userRepository.findByEmail(email);
    };

    findByUsername = async username => {
        return this.userRepository.findByUsername(username);
    };

    validateCredentials = async (email, password) => {
        return this.validateCredentialsUseCase.execute({ email, password });
    };
}
