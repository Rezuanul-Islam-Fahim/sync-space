import { AppError, ErrorCode, TokenVerificationError } from '../error/index.js';
import { catchAsync } from '../util/index.js';
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

        let currentUser;
        try {
            currentUser = await getUserUseCase.execute(
                'authId',
                decodedToken.sub
            );
        } catch (error) {
            if (
                error instanceof AppError &&
                error.errorCode === ErrorCode.RESOURCE_NOT_FOUND
            ) {
                throw new AppError(USER_UNAVAILABLE, ErrorCode.UNAUTHENTICATED);
            }
            throw error;
        }

        req.user = currentUser;
        next();
    });
};
