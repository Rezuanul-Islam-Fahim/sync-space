import { UnauthorizedError } from '../../../shared/error/index.js';
import {
    INVALID_TOKEN,
    TOKEN_NOT_FOUND,
} from '../domain/auth-user.constant.js';
import { catchAsync, headerTokenExtract } from '../../../shared/util/index.js';

/**
 * Middleware factory for authenticating HTTP requests using JWT tokens.
 *
 * @param {import('../application/auth.facade.js').AuthFacade} authService
 * @returns {import('express').RequestHandler}
 */
export const makeAuthenticate = ({
    verifyAccessTokenUseCase,
    getBlacklistedLoginUseCase,
}) => {
    return catchAsync(async (req, _, next) => {
        const token = headerTokenExtract(req.headers.authorization);

        if (!token) {
            next(new UnauthorizedError(TOKEN_NOT_FOUND));
            return;
        }

        const principal = await verifyAccessTokenUseCase.execute(token);

        const blacklistedToken = await getBlacklistedLoginUseCase.execute(
            principal.jti
        );

        if (blacklistedToken) {
            next(new UnauthorizedError(INVALID_TOKEN));
            return;
        }

        // Attach the authenticated principal details to the request. The
        // principal is an intent-revealing object created by the AuthFacade.
        req.user = { id: principal.id, email: principal.email };
        next();
    });
};
