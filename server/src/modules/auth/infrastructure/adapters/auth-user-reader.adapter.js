import { AuthUserReaderPort } from '../../application/ports/auth-user-reader.port.js';
import { AuthUser } from '../../domain/auth-user.entity.js';

export class AuthUserReaderAdapter extends AuthUserReaderPort {
    constructor({ getUserUseCase }) {
        super();
        this.getUserUseCase = getUserUseCase;
    }

    findByEmailWithPassword = async email => {
        const user = await this.getUserUseCase.byEmailWithCredentials(email);
        return user ? new AuthUser(user) : null;
    };

    findByUsername = async username => {
        const user = await this.getUserUseCase.byUsername(username);
        return user ? new AuthUser(user) : null;
    };
}
