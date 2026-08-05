import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { TokenGeneratorPort } from '../../application/ports/token-generator.port.js';
import { TokenVerifierPort } from '../../application/ports/token-verifier.port.js';
import { TokenVerificationError } from '../../domain/errors/token-verification.error.js';

const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JwtTokenGenerator extends TokenGeneratorPort {
    constructor({ secret, expiresIn, refreshSecret, refreshExpiresIn }) {
        super();
        this.secret = secret;
        this.expiresIn = expiresIn;
        this.refreshSecret = refreshSecret;
        this.refreshExpiresIn = refreshExpiresIn;
    }

    async generateTokens(userId, email) {
        const payload = { sub: userId, email };

        const [token, refreshToken] = await Promise.all([
            signAsync(payload, this.secret, {
                expiresIn: this.expiresIn,
            }),
            signAsync(payload, this.refreshSecret, {
                expiresIn: this.refreshExpiresIn,
            }),
        ]);

        return { token, refreshToken };
    }
}

export class JwtTokenVerifier extends TokenVerifierPort {
    constructor({ secret, refreshSecret }) {
        super();
        this.secret = secret;
        this.refreshSecret = refreshSecret;
    }

    async verifyAccessToken(token) {
        try {
            return await verifyAsync(token, this.secret);
        } catch (error) {
            throw new TokenVerificationError(error.message);
        }
    }

    async verifyRefreshToken(token) {
        try {
            return await verifyAsync(token, this.refreshSecret);
        } catch (error) {
            throw new TokenVerificationError(error.message);
        }
    }
}
