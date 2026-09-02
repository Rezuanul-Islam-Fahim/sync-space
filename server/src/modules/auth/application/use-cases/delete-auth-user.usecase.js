/**
 * Use case for deleting an auth credential record by ID.
 * Typically invoked as a compensating action during saga rollbacks.
 */
export class DeleteAuthUserUseCase {
    /**
     * @param {{
     *   authUserWriter: import('../ports/auth-user-writer.port.js').AuthUserWriterPort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ authUserWriter, logger }) {
        this.authUserWriter = authUserWriter;
        this.logger = logger;
    }

    /**
     * Executes deletion of auth credential by ID.
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async execute(id) {
        await this.authUserWriter.deleteById(id);
        this.logger?.info?.('Auth user credentials deleted', {
            authUserId: id,
        });
    }
}
