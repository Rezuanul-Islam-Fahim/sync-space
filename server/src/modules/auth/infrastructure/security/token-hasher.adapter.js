import { createHash, timingSafeEqual } from 'node:crypto';
import {
    TokenHashComparerPort,
    TokenHasherPort,
} from '../../application/ports/token-hasher.port.js';

export class TokenHasherAdapter extends TokenHasherPort {
    constructor({ algorithm, digest }) {
        super();
        this.algorithm = algorithm;
        this.digest = digest;
    }

    hash(token) {
        return createHash(this.algorithm).update(token).digest(this.digest);
    }
}

export class TokenHashComparerAdapter extends TokenHashComparerPort {
    constructor({ algorithm, digest }) {
        super();
        this.algorithm = algorithm;
        this.digest = digest;
    }

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
