import { AppError, ErrorCode, TokenVerificationError } from '../error/index.js';
import { catchAsync } from '../util/index.js';
import {
    TOKEN_NOT_FOUND,
    USER_UNAVAILABLE,
    INVALID_TOKEN,
} from '../constant/index.js';

/**
 * Middleware factory for authenticating HTTP requests.
 *
 * Operates purely on shared Port abstractions (`UserByIdPort` and `TokenVerifierPort`)
 * to keep shared infrastructure decoupled from specific domain use cases.
 *
 * @param {import('../ports/user-by-id.port.js').UserByIdPort} userReader
 * @param {import('../ports/token-verifier.port.js').TokenVerifierPort} tokenVerifier
 */
export const makeAuthenticate = (userReader, tokenVerifier) => {
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
            decodedToken = tokenVerifier.verifyAccessToken(token);
        } catch (error) {
            if (error instanceof TokenVerificationError) {
                throw new AppError(INVALID_TOKEN, ErrorCode.UNAUTHENTICATED);
            }
            throw error;
        }

        const currentUser = await userReader.findByAuthId(decodedToken.sub);
        if (!currentUser) {
            throw new AppError(USER_UNAVAILABLE, ErrorCode.UNAUTHENTICATED);
        }

        req.user = currentUser;
        next();
    });
};
