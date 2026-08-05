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
     * @param {object} data
     * @returns {Promise<import('../domain/user.entity.js').User>}
     */
    createUser(data) {
        return this.createUserUseCase.execute(data);
    }

    /**
     * Finds a user by username.
     *
     * @param {string} username
     * @returns {Promise<import('../domain/user.entity.js').User | null>}
     */
    findByUsername(username) {
        return this.getUserByUsernameUseCase.execute(username);
    }

    /**
     * Finds a user by profile ID.
     *
     * @param {string} id
     * @returns {Promise<import('../domain/user.entity.js').User | null>}
     */
    findById(id) {
        return this.getUserByIdUseCase.execute(id);
    }

    /**
     * Finds a user by auth credential ID.
     *
     * @param {string} authId
     * @returns {Promise<import('../domain/user.entity.js').User | null>}
     */
    findByAuthId(authId) {
        return this.getUserByAuthIdUseCase.execute(authId);
    }
}
