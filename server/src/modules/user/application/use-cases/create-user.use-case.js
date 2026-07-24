import { User } from '../../domain/user.entity.js';

export class CreateUserUseCase {
    constructor({ userWriter, logger }) {
        this.userWriter = userWriter;
        this.logger = logger;
    }

    execute = async data => {
        const userData = new User({
            id: data.id,
            email: data.email,
            username: data.username,
            displayName: data.displayName ?? null,
            dateOfBirth: data.dateOfBirth,
        });

        const createdUser = await this.userWriter.createUser(userData);
        return createdUser;
    };
}
