import jwt from 'jsonwebtoken';
import { AppError, TokenServicePort } from '../../index.js';
import { INVALID_TOKEN, UNAUTHORIZED } from '../../constants/index.js';

export default class JwtTokenService extends TokenServicePort {
    constructor({ secret, expiresIn, refreshSecret, refreshExpiresIn }) {
        super();
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
