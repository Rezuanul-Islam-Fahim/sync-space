import { AppError, ErrorCode } from '../error/app.error.js';
import { catchAsync } from '../util/catch-async.util.js';
import { TOKEN_NOT_FOUND, USER_UNAVAILABLE } from '../constant/index.js';

export const makeAuthenticate = (userRepository, tokenService) => {
    if (typeof userRepository?.findById !== 'function') {
        throw new Error(
            'makeAuthenticate: userRepository must implement findById method'
        );
    }
    if (typeof tokenService?.verifyAccessToken !== 'function') {
        throw new Error(
            'makeAuthenticate: tokenService must implement verifyAccessToken method'
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
            throw new AppError(TOKEN_NOT_FOUND, ErrorCode.UNAUTHORIZED);
        }

        const decodedToken = tokenService.verifyAccessToken(token);
        const currentUser = await userRepository.findById(decodedToken.sub);

        if (!currentUser) {
            throw new AppError(USER_UNAVAILABLE, ErrorCode.UNAUTHORIZED);
        }

        req.user = currentUser;
        next();
    });
};
