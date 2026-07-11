import { UserAuthDto, UserDto } from '../dto/user.dto.js';

export class GetUserUseCase {
    constructor({ userReader }) {
        if (!userReader) {
            throw new Error('GetUserUseCase: userReader is required');
        }
        this.userReader = userReader;
    }

    async forAuthByEmail(email) {
        const user = await this.userReader.findByEmailWithPassword(email);
        return user ? UserAuthDto.from(user) : null;
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
