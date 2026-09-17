import { createHash, timingSafeEqual } from 'node:crypto';
import {
    TokenHashComparerPort,
    TokenHasherPort,
} from '../../application/ports/token-hasher.port.js';

/**
 * Adapter implementing TokenHasherPort using Node.js crypto module.
 */
export class TokenHasherAdapter extends TokenHasherPort {
    /**
     * @param {{ algorithm: string, digest: import('node:crypto').BinaryToTextEncoding }} options
     */
    constructor({ algorithm, digest }) {
        super();
        this.algorithm = algorithm;
        this.digest = digest;
    }

    /**
     * Hashes the given token.
     *
     * @param {string} token
     * @returns {string}
     */
    hash(token) {
        return createHash(this.algorithm).update(token).digest(this.digest);
    }
}

/**
 * Adapter implementing TokenHashComparerPort using Node.js crypto module.
 */
export class TokenHashComparerAdapter extends TokenHashComparerPort {
    /**
     * @param {{ algorithm: string, digest: import('node:crypto').BinaryToTextEncoding }} options
     */
    constructor({ algorithm, digest }) {
        super();
        this.algorithm = algorithm;
        this.digest = digest;
    }

    /**
     * Compares an incoming token with a stored hash safely to prevent timing attacks.
     *
     * @param {string} incomingToken
     * @param {string} storedHashedHex
     * @returns {boolean}
     */
    compare(incomingToken, storedHashedHex) {
        const incomingHashHex = createHash(this.algorithm)
            .update(incomingToken)
            .digest(this.digest);

        const incomingBuffer = Buffer.from(incomingHashHex, 'utf8');
        const storedBuffer = Buffer.from(storedHashedHex, 'utf8');

        if (incomingBuffer.length !== storedBuffer.length) {
            return false;
        }

        return timingSafeEqual(incomingBuffer, storedBuffer);
    }
}
