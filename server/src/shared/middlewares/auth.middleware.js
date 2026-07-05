import AppError from '../errors/app.error.js';
import catchAsync from '../catch-async.util.js';
import {
    TOKEN_NOT_FOUND,
    USER_UNAVAILABLE,
    UNAUTHORIZED,
} from '../../constants/index.js';

import { UserServicePort } from '../../modules/user/index.js';
import { TokenServicePort } from '../ports/token-service.port.js';

export const makeAuthenticate = (userService, tokenService) => {
    if (!(userService instanceof UserServicePort)) {
        throw new Error(
            'makeAuthenticate: userService must implement UserServicePort'
        );
    }
    if (!(tokenService instanceof TokenServicePort)) {
        throw new Error(
            'makeAuthenticate: tokenService must implement TokenServicePort'
        );
    }
    return catchAsync(async (req, _, next) => {
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
        const currentUser = await userService.findById(decodedToken.sub);

        if (!currentUser) {
            throw new AppError(USER_UNAVAILABLE, UNAUTHORIZED);
        }

        req.user = currentUser;
        next();
    });
};
