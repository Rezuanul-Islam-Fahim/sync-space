import bcrypt from 'bcrypt';
import AppError from '../../../common/app-error.js';
import { INVALID_CREDENTIALS } from '../../../constants/app-messages.js';
import { UNAUTHORIZED } from '../../../constants/http-status.js';
import { generateToken } from '../../../utils/jwt.util.js';

export class LoginUserUseCase {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    async execute(data) {
        const user = await this.userRepository.findByEmail(data.email);

        if (!user) {
            throw new AppError(INVALID_CREDENTIALS, UNAUTHORIZED);
        }

        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) {
            throw new AppError(INVALID_CREDENTIALS, UNAUTHORIZED);
        }

        const tokens = generateToken(user._id, user.email);

        return { user, tokens };
    }
}
