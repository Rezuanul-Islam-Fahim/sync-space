import { AppError, ErrorCode } from '../../../shared/error/index.js';
import { catchAsync } from '../../../shared/util/index.js';
import { TokenVerificationError } from '../domain/errors/token-verification.error.js';
import {
    INVALID_TOKEN,
    TOKEN_NOT_FOUND,
} from '../domain/auth-user.constant.js';

/**
 * Middleware factory for authenticating HTTP requests using JWT tokens.
 *
 * @param {import('../application/auth.facade.js').AuthFacade} authService
 */
export const makeAuthenticate = authService => {
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
            decodedToken = authService.verifyAccessToken(token);
        } catch (error) {
            if (error instanceof TokenVerificationError) {
                throw new AppError(INVALID_TOKEN, ErrorCode.UNAUTHENTICATED);
            }
            throw error;
        }

        // Attach the authenticated principal (AuthUser) details to the request.
        req.user = { id: decodedToken.sub, email: decodedToken.email };
        next();
    });
};
