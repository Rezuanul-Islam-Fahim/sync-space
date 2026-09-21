import { UserProfileDto } from './dtos/user-profile.dto.js';

/**
 * Public API Facade for the User Bounded Context.
 * Acts as the single entry point for cross-module operations involving users.
 */
export class UserFacade {
    /**
     * @param {{
     *   createUserUseCase: import('./use-cases/create-user.usecase.js').CreateUserUseCase,
     *   getUserByUsernameUseCase: import('./use-cases/get-user-by-username.usecase.js').GetUserByUsernameUseCase,
     *   getUserByIdUseCase: import('./use-cases/get-user-by-id.usecase.js').GetUserByIdUseCase,
     *   getUserByAuthIdUseCase: import('./use-cases/get-user-by-auth-id.usecase.js').GetUserByAuthIdUseCase
     * }} deps
     */
    constructor({
        createUserUseCase,
        getUserByUsernameUseCase,
        getUserByIdUseCase,
        getUserByAuthIdUseCase,
    }) {
        this.createUserUseCase = createUserUseCase;
        this.getUserByUsernameUseCase = getUserByUsernameUseCase;
        this.getUserByIdUseCase = getUserByIdUseCase;
        this.getUserByAuthIdUseCase = getUserByAuthIdUseCase;
    }

    /**
     * Creates a new user profile.
     *
     * @param {{ authId: string, username: string, displayName?: string, dateOfBirth: Date | string }} data
     * @returns {Promise<UserProfileDto>}
     */
    async createUser(data) {
        const user = await this.createUserUseCase.execute(data);
        return UserProfileDto.fromEntity(user);
    }

    /**
     * Finds a user by username.
     *
     * @param {string} username
     * @returns {Promise<UserProfileDto | null>}
     */
    async findByUsername(username) {
        const user = await this.getUserByUsernameUseCase.execute(username);
        return UserProfileDto.fromEntity(user);
    }

    /**
     * Finds a user by profile ID.
     *
     * @param {string} id
     * @returns {Promise<UserProfileDto | null>}
     */
    async findById(id) {
        const user = await this.getUserByIdUseCase.execute(id);
        return UserProfileDto.fromEntity(user);
    }

    /**
     * Finds a user by auth credential ID.
     *
     * @param {string} authId
     * @returns {Promise<UserProfileDto | null>}
     */
    async findByAuthId(authId) {
        const user = await this.getUserByAuthIdUseCase.execute(authId);
        return UserProfileDto.fromEntity(user);
    }
}
