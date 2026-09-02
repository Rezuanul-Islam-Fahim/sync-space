/**
 * Use case for retrieving a user profile entity by its unique ID.
 */
export class GetUserByIdUseCase {
    /**
     * @param {{
     *   userReader: import('../ports/user-reader.port.js').UserReaderPort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ userReader, logger }) {
        this.userReader = userReader;
        this.logger = logger;
    }

    /**
     * Executes user profile retrieval by ID.
     *
     * @param {string} id
     * @returns {Promise<import('../../domain/user.entity.js').User | null>}
     */
    async execute(id) {
        const user = await this.userReader.findById(id);
        if (!user) {
            this.logger?.debug?.('User profile not found by ID', { id });
            return null;
        }
        return user;
    }
}
