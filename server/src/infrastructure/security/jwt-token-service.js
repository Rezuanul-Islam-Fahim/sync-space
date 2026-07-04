import jwt from 'jsonwebtoken';

export default class JwtTokenService {
    constructor({ secret, expiresIn, refreshSecret, refreshExpiresIn }) {
        this.secret = secret;
        this.expiresIn = expiresIn;
        this.refreshSecret = refreshSecret;
        this.refreshExpiresIn = refreshExpiresIn;
    }

    generateToken = (userId, email) => {
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
        return jwt.verify(token, this.secret);
    };

    verifyRefreshToken = token => {
        return jwt.verify(token, this.refreshSecret);
    };
}
