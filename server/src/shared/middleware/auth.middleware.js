import { AppError, ErrorCode } from '../error/app.error.js';
import { catchAsync } from '../util/catch-async.util.js';
import { TOKEN_NOT_FOUND, USER_UNAVAILABLE } from '../constant/index.js';

export const makeAuthenticate = (getUserUseCase, tokenService) => {
    if (typeof getUserUseCase?.byId !== 'function') {
        throw new Error(
            'makeAuthenticate: getUserUseCase must implement byId method'
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
        const currentUser = await getUserUseCase.byId(decodedToken.sub);

        if (!currentUser) {
            throw new AppError(USER_UNAVAILABLE, ErrorCode.UNAUTHORIZED);
        }

        req.user = currentUser;
        next();
    });
};
