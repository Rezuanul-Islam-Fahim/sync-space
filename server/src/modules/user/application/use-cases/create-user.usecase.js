import { User } from '../../domain/user.entity.js';

export class CreateUserUseCase {
    constructor({ userWriter, logger }) {
        this.userWriter = userWriter;
        this.logger = logger;
    }

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
