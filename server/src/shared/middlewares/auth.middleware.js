import AppError from '../errors/app.error.js';
import catchAsync from '../utils/catch-async.util.js';
import { TOKEN_NOT_FOUND, USER_UNAVAILABLE } from '../constants/index.js';

import { TokenVerifierPort } from '../ports/token-verifier.port.js';

export const makeAuthenticate = (userRepository, tokenService) => {
    if (!userRepository || typeof userRepository.findById !== 'function') {
        throw new Error(
            'makeAuthenticate: userRepository must be an object with a findById method'
        );
    }
    if (!(tokenService instanceof TokenVerifierPort)) {
        throw new Error(
            'makeAuthenticate: tokenService must implement TokenVerifierPort'
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
            throw new AppError(TOKEN_NOT_FOUND, 'UNAUTHORIZED');
        }

        const decodedToken = tokenService.verifyAccessToken(token);
        const currentUser = await userRepository.findById(decodedToken.sub);

        if (!currentUser) {
            throw new AppError(USER_UNAVAILABLE, 'UNAUTHORIZED');
        }

        req.user = currentUser;
        next();
    });
};
