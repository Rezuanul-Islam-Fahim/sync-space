/**
 * Use case for retrieving a user profile entity by its associated auth ID.
 */
export class GetUserByAuthIdUseCase {
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
     * Executes user profile retrieval by auth ID.
     *
     * @param {string} authId
     * @returns {Promise<import('../../domain/user.entity.js').User | null>}
     */
    async execute(authId) {
        const user = await this.userReader.findByAuthId(authId);
        if (!user) {
            this.logger?.debug?.('User profile not found by authId', {
                authId,
            });
            return null;
        }
        return user;
    }
}
