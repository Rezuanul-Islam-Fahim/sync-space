/**
 * Public API Facade for the User Bounded Context.
 * Acts as the single entry point for cross-module operations involving users.
 */
export class UserFacade {
    /**
     * @param {{
     *   createUserUseCase: import('./use-cases/create-user.usecase.js').CreateUserUseCase,
     *   userReader?: import('./ports/user-reader.port.js').UserReaderPort
     * }} deps
     */
    constructor({ createUserUseCase, userReader }) {
        this.createUserUseCase = createUserUseCase;
        this.userReader = userReader;
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
        return this.userReader?.findByUsername(username);
    }

    /**
     * Finds a user by email.
     *
     * @param {string} email
     * @returns {Promise<import('../domain/user.entity.js').User | null>}
     */
    findByEmail(email) {
        return this.userReader?.findByEmail(email);
    }

    /**
     * Finds a user by profile ID.
     *
     * @param {string} id
     * @returns {Promise<import('../domain/user.entity.js').User | null>}
     */
    findById(id) {
        return this.userReader?.findById(id);
    }
}
