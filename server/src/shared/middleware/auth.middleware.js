import { AppError, ErrorCode } from '../error/app.error.js';
import { catchAsync } from '../util/catch-async.util.js';
import { TOKEN_NOT_FOUND, USER_UNAVAILABLE } from '../constant/index.js';

export const makeAuthenticate = (getUserUseCase, tokenService) => {
    return catchAsync(async (req, _, next) => {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new AppError(TOKEN_NOT_FOUND, ErrorCode.UNAUTHENTICATED);
        }

        const decodedToken = tokenService.verifyAccessToken(token);
        const currentUser = await getUserUseCase.byId(decodedToken.sub);

        if (!currentUser) {
            throw new AppError(USER_UNAVAILABLE, ErrorCode.UNAUTHENTICATED);
        }

        req.user = currentUser;
        next();
    });
};
