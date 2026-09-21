import { UnauthorizedError } from '../error/index.js';
import { TOKEN_NOT_FOUND } from '../constants/index.js';
import { catchAsync, headerTokenExtract } from '../util/index.js';

/**
 * Creates an authentication Express middleware using the provided AuthFacade instance.
 *
 * @param {{
 *   authService: import('../../modules/auth/application/auth.facade.js').AuthFacade
 * }} deps
 * @returns {import('express').RequestHandler}
 */
export const makeAuthenticate = ({ authService }) => {
    return catchAsync(async (req, _, next) => {
        const accessToken = headerTokenExtract(req.headers.authorization);

        if (!accessToken) {
            next(new UnauthorizedError(TOKEN_NOT_FOUND));
            return;
        }

        const principal = await authService.verifyAccessToken(accessToken);

        // Attach the authenticated principal claims to the request
        req.user = { id: principal.id, email: principal.email };
        next();
    });
};
