import { AppError, ErrorCode } from '../error/app.error.js';
import { TokenVerificationError } from '../error/token-verification.error.js';
import { catchAsync } from '../util/catch-async.util.js';
import {
    TOKEN_NOT_FOUND,
    USER_UNAVAILABLE,
    INVALID_TOKEN,
} from '../constant/index.js';

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

        let decodedToken;
        try {
            decodedToken = tokenService.verifyAccessToken(token);
        } catch (error) {
            if (error instanceof TokenVerificationError) {
                throw new AppError(INVALID_TOKEN, ErrorCode.UNAUTHENTICATED);
            }
            throw error;
        }

        const currentUser = await getUserUseCase.byId(decodedToken.sub);

        if (!currentUser) {
            throw new AppError(USER_UNAVAILABLE, ErrorCode.UNAUTHENTICATED);
        }

        req.user = currentUser;
        next();
    });
};
