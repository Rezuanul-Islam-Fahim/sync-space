import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { TokenGeneratorPort } from '../../application/ports/token-generator.port.js';
import { TokenVerifierPort } from '../../application/ports/token-verifier.port.js';
import { TokenVerificationError } from '../../domain/errors/token-verification.error.js';

const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JwtTokenGenerator extends TokenGeneratorPort {
    constructor({
        secret,
        expiresIn,
        refreshSecret,
        refreshExpiresIn,
        algorithm = 'HS256',
    }) {
        super();
        this.secret = secret;
        this.expiresIn = expiresIn;
        this.refreshSecret = refreshSecret;
        this.refreshExpiresIn = refreshExpiresIn;
        this.algorithm = algorithm;
    }

    async generateTokens(userId, email) {
        const payload = { sub: userId, email };

        const [token, refreshToken] = await Promise.all([
            signAsync(payload, this.secret, {
                algorithm: this.algorithm,
                expiresIn: this.expiresIn,
            }),
            signAsync(payload, this.refreshSecret, {
                algorithm: this.algorithm,
                expiresIn: this.refreshExpiresIn,
            }),
        ]);

        return { token, refreshToken };
    }
}

export class JwtTokenVerifier extends TokenVerifierPort {
    constructor({ secret, refreshSecret, algorithm = 'HS256' }) {
        super();
        this.secret = secret;
        this.refreshSecret = refreshSecret;
        this.algorithm = algorithm;
    }

    async verifyAccessToken(token) {
        try {
            return await verifyAsync(token, this.secret, {
                algorithms: [this.algorithm],
            });
        } catch (error) {
            throw new TokenVerificationError(error.message);
        }
    }

    async verifyRefreshToken(token) {
        try {
            return await verifyAsync(token, this.refreshSecret, {
                algorithms: [this.algorithm],
            });
        } catch (error) {
            throw new TokenVerificationError(error.message);
        }
    }
}
