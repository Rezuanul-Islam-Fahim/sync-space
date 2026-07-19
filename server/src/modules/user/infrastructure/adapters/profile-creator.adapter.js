import { ProfileCreatorPort } from '../../../auth/application/ports/profile-creator.port.js';
import { AppError, ErrorCode } from '../../../../shared/error/index.js';

/**
 * Implements `ProfileCreatorPort` from the auth bounded context.
 *
 * This adapter is the only place in the user module that imports from the auth
 * module — and it only imports the port interface (no domain or infrastructure
 * from auth).  It is wired up in the composition root so that the auth module
 * itself never imports from the user module.
 */
export class ProfileCreatorAdapter extends ProfileCreatorPort {
    constructor({ userModel }) {
        super();
        this.userModel = userModel;
    }

    createProfile = async ({ userId, registrationData }) => {
        const { email, username, displayName, dateOfBirth } = registrationData;

        try {
            const profile = new this.userModel({
                _id: userId,
                email,
                username,
                displayName: displayName ?? null,
                dateOfBirth,
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
