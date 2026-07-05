import AppError from '../errors/app.error.js';
import catchAsync from '../catch-async.util.js';
import {
    TOKEN_NOT_FOUND,
    USER_UNAVAILABLE,
} from '../../constants/app-messages.constant.js';
import { UNAUTHORIZED } from '../../constants/http-status.constant.js';

import { UserRepositoryPort } from '../../modules/user/index.js';
import { TokenServicePort } from '../ports/token-service.port.js';

export const makeAuthenticate = (userRepository, tokenService) => {
    if (!(userRepository instanceof UserRepositoryPort)) {
        throw new Error(
            'makeAuthenticate: userRepository must implement UserRepositoryPort'
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
        const currentUser = await userRepository.findById(decodedToken.sub);

        if (!currentUser) {
            throw new AppError(USER_UNAVAILABLE, UNAUTHORIZED);
        }

        req.user = currentUser;
        next();
    });
};
