import { UserRepositoryPort } from '../ports/user-repository.port.js';

export class FindUserByUsernameUseCase {
    constructor({ userRepository }) {
        if (!(userRepository instanceof UserRepositoryPort)) {
            throw new Error(
                'FindUserByUsernameUseCase: userRepository must implement UserRepositoryPort'
            );
        }
        this.userRepository = userRepository;
    }

    execute = async username => {
        return this.userRepository.findByUsername(username);
    };
}
