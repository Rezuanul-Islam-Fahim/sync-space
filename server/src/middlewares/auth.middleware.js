import AppError from '../common/app-error.js';
import catchAsync from '../common/catch-async.js';
import {
    INVALID_TOKEN,
    TOKEN_NOT_FOUND,
    USER_UNAVAILABLE,
} from '../constants/app-messages.js';
import { UNAUTHORIZED } from '../constants/http-status';
import { userRepo } from '../modules/user/index.js';
import { verifyAccessToken } from '../utils/jwt.util.js';

export const authenticate = catchAsync(async (req, _, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new AppError(TOKEN_NOT_FOUND, UNAUTHORIZED);
    }

    try {
        const decodedToken = verifyAccessToken(token);

        const currentUser = await userRepo.findById(decodedToken.sub);

        if (!currentUser) {
            throw new AppError(USER_UNAVAILABLE, UNAUTHORIZED);
        }

        req.user = currentUser;
        next();
    } catch (err) {
        throw new AppError(INVALID_TOKEN, UNAUTHORIZED);
    }
});
