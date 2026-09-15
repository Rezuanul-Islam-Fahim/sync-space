import { User } from '../../domain/user.entity.js';

/**
 * Use case for creating and persisting a new user profile entity.
 */
export class CreateUserUseCase {
    /**
     * @param {{
     *   userWriter: import('../ports/user-writer.port.js').UserWriterPort,
     *   logger?: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ userWriter, logger }) {
        this.userWriter = userWriter;
        this.logger = logger;
    }

    /**
     * Executes user profile creation.
     *
     * @param {{ authId: string, username: string, displayName?: string, dateOfBirth: Date|string }} data
     * @returns {Promise<import('../../domain/user.entity.js').User>}
     */
    async execute(data) {
        const userData = User.create({
            authId: data.authId,
            username: data.username,
            displayName: data.displayName ?? null,
            dateOfBirth: data.dateOfBirth,
        });

        const createdUser = await this.userWriter.createUser(userData);
        this.logger?.info?.('User profile created successfully', {
            userId: createdUser.id,
            authId: createdUser.authId,
            username: createdUser.username,
        });
        return createdUser;
    }
}
