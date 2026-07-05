import { UserRepositoryPort } from '../ports/user-repository.port.js';

export class CreateUserUseCase {
    constructor({ userRepository }) {
        if (!(userRepository instanceof UserRepositoryPort)) {
            throw new Error(
                'CreateUserUseCase: userRepository must implement UserRepositoryPort'
            );
        }
        this.userRepository = userRepository;
    }

    execute = async userData => {
        return this.userRepository.createUser(userData);
    };
}
