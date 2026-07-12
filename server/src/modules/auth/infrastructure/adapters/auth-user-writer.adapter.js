import { AuthUserWriterPort } from '../../application/ports/auth-user-writer.port.js';
import { AuthUser } from '../../domain/auth-user.entity.js';

export class AuthUserWriterAdapter extends AuthUserWriterPort {
    constructor({ userModel }) {
        super();
        this.userModel = userModel;
    }

    createUser = async userData => {
        const newUser = new this.userModel(userData);
        const savedUser = await newUser.save();
        return savedUser ? new AuthUser(savedUser.toObject()) : null;
    };
}
