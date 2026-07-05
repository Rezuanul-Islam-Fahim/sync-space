import { UserRepositoryPort } from '../ports/user-repository.port.js';

export class FindUserByEmailUseCase {
    constructor({ userRepository }) {
        if (!(userRepository instanceof UserRepositoryPort)) {
            throw new Error(
                'FindUserByEmailUseCase: userRepository must implement UserRepositoryPort'
            );
        }
        this.userRepository = userRepository;
    }

    execute = async email => {
        return this.userRepository.findByEmail(email);
    };
}
