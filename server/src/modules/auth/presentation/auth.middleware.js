import { AppError, ErrorCode } from '../../../shared/error/index.js';
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
    return (req, _, next) => {
        try {
            let token;

            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                token = req.headers.authorization.split(' ')[1];
            }

            if (!token) {
                return next(
                    new AppError(TOKEN_NOT_FOUND, ErrorCode.UNAUTHENTICATED)
                );
            }

            const principal = authService.verifyAccessToken(token);

            // Attach the authenticated principal details to the request. The
            // principal is an intent-revealing object created by the AuthFacade.
            req.user = { id: principal.id, email: principal.email };
            next();
        } catch (error) {
            if (error instanceof TokenVerificationError) {
                return next(
                    new AppError(INVALID_TOKEN, ErrorCode.UNAUTHENTICATED)
                );
            }
            next(error);
        }
    };
};
