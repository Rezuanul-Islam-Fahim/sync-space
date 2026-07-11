import { AuthUserWriterPort } from '../../application/ports/auth-user-writer.port.js';
import { AuthUser } from '../../domain/auth-user.entity.js';

export class AuthUserWriterAdapter extends AuthUserWriterPort {
    constructor({ createUserUseCase }) {
        super();
        this.createUserUseCase = createUserUseCase;
    }

    createUser = async userData => {
        const user = await this.createUserUseCase.execute(userData);
        return user ? new AuthUser(user) : null;
    };
}
