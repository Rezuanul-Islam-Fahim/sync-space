import { UserServicePort } from '../ports/user-service.port.js';
import { UserRepositoryPort } from '../ports/user-repository.port.js';

export class UserService extends UserServicePort {
    constructor(userRepository) {
        super();
        if (!(userRepository instanceof UserRepositoryPort)) {
            throw new Error(
                'UserService: userRepository must implement UserRepositoryPort'
            );
        }
        this.userRepository = userRepository;
    }

    async createUser(userData) {
        return this.userRepository.createUser(userData);
    }

    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }

    async findByEmailWithPassword(email) {
        return this.userRepository.findByEmailWithPassword(email);
    }

    async findByUsername(username) {
        return this.userRepository.findByUsername(username);
    }

    async findById(id) {
        return this.userRepository.findById(id);
    }
}
