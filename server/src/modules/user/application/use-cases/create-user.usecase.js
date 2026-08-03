import { User } from '../../domain/user.entity.js';

export class CreateUserUseCase {
    constructor({ userWriter, logger }) {
        this.userWriter = userWriter;
        this.logger = logger;
    }

    async execute(data) {
        const userData = new User({
            authId: data.authId,
            email: data.email,
            username: data.username,
            displayName: data.displayName ?? null,
            dateOfBirth: data.dateOfBirth,
        });

        const createdUser = await this.userWriter.createUser(userData);
        return createdUser;
    }
}
