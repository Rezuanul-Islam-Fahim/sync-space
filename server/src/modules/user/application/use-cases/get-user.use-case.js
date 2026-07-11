import { UserCredentialsDto, UserDto } from '../dto/user.dto.js';

export class GetUserUseCase {
    constructor({ userReader }) {
        if (!userReader) {
            throw new Error('GetUserUseCase: userReader is required');
        }
        this.userReader = userReader;
    }

    async byEmailWithCredentials(email) {
        const user = await this.userReader.findByEmailWithPassword(email);
        return user ? UserCredentialsDto.from(user) : null;
    }

    async byUsername(username) {
        const user = await this.userReader.findByUsername(username);
        return user ? UserDto.from(user) : null;
    }

    async byId(id) {
        const user = await this.userReader.findById(id);
        return user ? UserDto.from(user) : null;
    }
}
