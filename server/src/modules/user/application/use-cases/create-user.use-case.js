import { User } from '../../domain/user.entity.js';

export class CreateUserUseCase {
    constructor({ userWriter, logger }) {
        this.userWriter = userWriter;
        this.logger = logger;
    }

    async execute(data) {
        const user = new User({
            id: data.id,
            email: data.email,
            username: data.username,
            displayName: data.displayName ?? null,
            dateOfBirth: data.dateOfBirth,
        });

        await this.userWriter.createUser(user);
        return user;
    }
}
