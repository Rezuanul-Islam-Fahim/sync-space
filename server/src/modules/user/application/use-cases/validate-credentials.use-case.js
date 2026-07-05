import { PasswordHasherPort } from '../../../../shared/index.js';
import { UserRepositoryPort } from '../ports/user-repository.port.js';

export class ValidateCredentialsUseCase {
    constructor({ userRepository, passwordHasher }) {
        if (!(userRepository instanceof UserRepositoryPort)) {
            throw new Error(
                'ValidateCredentialsUseCase: userRepository must implement UserRepositoryPort'
            );
        }
        if (!(passwordHasher instanceof PasswordHasherPort)) {
            throw new Error(
                'ValidateCredentialsUseCase: passwordHasher must implement PasswordHasherPort'
            );
        }
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    execute = async ({ email, password }) => {
        const user = await this.userRepository.findByEmailWithPassword(email);
        if (!user) {
            return null;
        }

        const isMatch = await this.passwordHasher.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return null;
        }

        // Prevent password hash from leaving the user module
        return user.excludePassword();
    };
}
