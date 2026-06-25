import bcrypt from 'bcrypt';
import { userRepo } from '../user/index.js';
import AppError from '../../common/app-error.js';
import { CONFLICT, UNAUTHORIZED } from '../../constants/http-status.js';
import config from '../../config/index.js';
import {
    EMAIL_ALREADY_REGISTERED,
    USERNAME_ALREADY_TAKEN,
    INVALID_CREDENTIALS,
} from '../../constants/app-messages.js';

export const registerUser = async data => {
    const existingUserByEmail = await userRepo.findByEmail(data.email);

    if (existingUserByEmail) {
        throw new AppError(EMAIL_ALREADY_REGISTERED, CONFLICT);
    }

    const existingUserByUsername = await userRepo.findByUsername(data.username);

    if (existingUserByUsername) {
        throw new AppError(USERNAME_ALREADY_TAKEN, CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(
        data.password,
        config.auth.saltRounds
    );

    const newUser = await userRepo.createUser({
        ...data,
        password: hashedPassword,
    });

    return newUser;
};

export const loginUser = async data => {
    const user = await userRepo.findByEmail(data.email);

    if (!user) {
        throw new AppError(INVALID_CREDENTIALS, UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
        throw new AppError(INVALID_CREDENTIALS, UNAUTHORIZED);
    }

    return user;
};
