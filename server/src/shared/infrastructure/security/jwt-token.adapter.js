import jwt from 'jsonwebtoken';
import {
    AppError,
    ErrorCode,
    TokenGeneratorPort,
    TokenVerifierPort,
} from '../../index.js';
import { INVALID_TOKEN } from '../../constant/index.js';

export class JwtTokenGenerator extends TokenGeneratorPort {
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
}

export class JwtTokenVerifier extends TokenVerifierPort {
    constructor({ secret, refreshSecret }) {
        super();
        this.secret = secret;
        this.refreshSecret = refreshSecret;
    }

    verifyAccessToken = token => {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            throw new AppError(INVALID_TOKEN, ErrorCode.UNAUTHORIZED);
        }
    };

    verifyRefreshToken = token => {
        try {
            return jwt.verify(token, this.refreshSecret);
        } catch (error) {
            throw new AppError(INVALID_TOKEN, ErrorCode.UNAUTHORIZED);
        }
    };
}
