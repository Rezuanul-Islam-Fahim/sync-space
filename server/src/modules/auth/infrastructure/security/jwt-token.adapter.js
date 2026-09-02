import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { TokenGeneratorPort } from '../../application/ports/token-generator.port.js';
import { TokenVerifierPort } from '../../application/ports/token-verifier.port.js';
import {
    TokenExpiredError,
    TokenInvalidError,
} from './errors/token-verification.error.js';

const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

/**
 * Adapter implementing TokenGeneratorPort for signing JSON Web Tokens.
 */
export class JwtTokenGenerator extends TokenGeneratorPort {
    /**
     * @param {{
     *   secret: string,
     *   expiresIn: string,
     *   refreshSecret: string,
     *   refreshExpiresIn: string,
     *   algorithm?: string
     * }} options
     */
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

    /**
     * Generates a pair of access and refresh tokens for the given user identity.
     *
     * @param {string} userId
     * @param {string} email
     * @param {string} sessionId
     * @returns {Promise<{ token: string, refreshToken: string }>}
     */
    async generateTokens(userId, email, sessionId) {
        const [token, refreshToken] = await Promise.all([
            signAsync({ sub: userId, email }, this.secret, {
                algorithm: this.algorithm,
                expiresIn: this.expiresIn,
            }),
            signAsync({ sub: userId, email, sessionId }, this.refreshSecret, {
                algorithm: this.algorithm,
                expiresIn: this.refreshExpiresIn,
            }),
        ]);

        return { token, refreshToken };
    }
}

/**
 * Adapter implementing TokenVerifierPort for verifying and decoding JSON Web Tokens.
 */
export class JwtTokenVerifier extends TokenVerifierPort {
    /**
     * @param {{
     *   secret: string,
     *   refreshSecret: string,
     *   algorithm?: string
     * }} options
     */
    constructor({ secret, refreshSecret, algorithm = 'HS256' }) {
        super();
        this.secret = secret;
        this.refreshSecret = refreshSecret;
        this.algorithm = algorithm;
    }

    /**
     * Verifies the authenticity and expiration of an access token.
     *
     * @param {string} token
     * @returns {Promise<object>}
     */
    async verifyAccessToken(token) {
        try {
            return await verifyAsync(token, this.secret, {
                algorithms: [this.algorithm],
            });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new TokenExpiredError(error.message, error);
            }
            throw new TokenInvalidError(error.message, error);
        }
    }

    /**
     * Verifies the authenticity and expiration of a refresh token.
     *
     * @param {string} token
     * @returns {Promise<object>}
     */
    async verifyRefreshToken(token) {
        try {
            return await verifyAsync(token, this.refreshSecret, {
                algorithms: [this.algorithm],
            });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new TokenExpiredError(error.message, error);
            }
            throw new TokenInvalidError(error.message, error);
        }
    }
}
