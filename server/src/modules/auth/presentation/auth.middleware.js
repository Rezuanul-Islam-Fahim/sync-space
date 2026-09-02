import { UnauthorizedError } from '../../../shared/error/index.js';
import { TOKEN_NOT_FOUND } from '../domain/auth-user.constant.js';
import { catchAsync } from '../../../shared/util/index.js';

/**
 * Middleware factory for authenticating HTTP requests using JWT tokens.
 *
 * @param {import('../application/auth.facade.js').AuthFacade} authService
 * @returns {import('express').RequestHandler}
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
            next(new UnauthorizedError(TOKEN_NOT_FOUND));
            return;
        }

        const principal = await authService.verifyAccessToken(token);

        // Attach the authenticated principal details to the request. The
        // principal is an intent-revealing object created by the AuthFacade.
        req.user = { id: principal.id, email: principal.email };
        next();
    });
};
