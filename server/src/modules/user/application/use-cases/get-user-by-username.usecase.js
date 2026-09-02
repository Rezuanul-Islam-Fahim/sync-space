/**
 * Use case for retrieving a user profile entity by its unique username.
 */
export class GetUserByUsernameUseCase {
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
     * Executes user profile retrieval by username.
     *
     * @param {string} username
     * @returns {Promise<import('../../domain/user.entity.js').User | null>}
     */
    async execute(username) {
        const user = await this.userReader.findByUsername(username);
        if (!user) {
            this.logger?.debug?.('User profile not found by username', {
                username,
            });
            return null;
        }
        return user;
    }
}
