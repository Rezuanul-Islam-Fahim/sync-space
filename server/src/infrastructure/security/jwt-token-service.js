import jwt from 'jsonwebtoken';
import { INVALID_TOKEN } from '../../constants/app-messages.js';
import AppError from '../../common/errors/app-error.js';
import { UNAUTHORIZED } from '../../constants/http-status.js';

export default class JwtTokenService {
    constructor({ secret, expiresIn, refreshSecret, refreshExpiresIn }) {
        this.secret = secret;
        this.expiresIn = expiresIn;
        this.refreshSecret = refreshSecret;
        this.refreshExpiresIn = refreshExpiresIn;
    }

    generateTokens = (userId, email) => {
        const payload = { sub: userId, email };

        const token = jwt.sign(payload, this.secret, {
            expiresIn: this.expiresIn,
        });

        const refreshToken = jwt.sign(payload, this.refreshSecret, {
            expiresIn: this.refreshExpiresIn,
        });

        return { token, refreshToken };
    };

    verifyAccessToken = token => {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            throw new AppError(INVALID_TOKEN, UNAUTHORIZED);
        }
    };

    verifyRefreshToken = token => {
        try {
            return jwt.verify(token, this.refreshSecret);
        } catch (error) {
            throw new AppError(INVALID_TOKEN, UNAUTHORIZED);
        }
    };
}
