import { UserWriterPort } from '../../application/ports/user-writer.port.js';
import { AppError, ErrorCode } from '../../../../shared/error/index.js';

export class UserWriterAdapter extends UserWriterPort {
    constructor({ userModel }) {
        super();
        this.userModel = userModel;
    }

    createUser = async user => {
        try {
            const profile = new this.userModel({
                _id: user.id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                dateOfBirth: user.dateOfBirth,
            });

            await profile.save();
        } catch (err) {
            if (err.code === 11000) {
                // MongoDB duplicate key error
                throw new AppError(
                    'Profile already exists',
                    ErrorCode.ALREADY_EXISTS
                );
            }
            throw err;
        }
    };
}
