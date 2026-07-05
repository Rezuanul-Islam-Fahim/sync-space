import AppError from '../common/errors/app.error.js';
import catchAsync from '../common/catch-async.js';
import {
    TOKEN_NOT_FOUND,
    USER_UNAVAILABLE,
} from '../constants/app-messages.constant.js';
import { UNAUTHORIZED } from '../constants/http-status.constant.js';

export const makeAuthenticate = (userRepository, tokenService) =>
    catchAsync(async (req, _, next) => {
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

        const decodedToken = tokenService.verifyAccessToken(token);
        const currentUser = await userRepository.findById(decodedToken.sub);

        if (!currentUser) {
            throw new AppError(USER_UNAVAILABLE, UNAUTHORIZED);
        }

        req.user = currentUser;
        next();
    });
