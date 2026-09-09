import { createHash, timingSafeEqual } from 'node:crypto';
import {
    TokenHashComparerPort,
    TokenHasherPort,
} from '../../application/ports/token-hasher.port.js';

export class TokenHasherAdapter extends TokenHasherPort {
    hash(algorithm, digest, token) {
        return createHash(algorithm).update(token).digest(digest);
    }
}

export class TokenHashComparerAdapter extends TokenHashComparerPort {
    compare(algorithm, digest, incomingToken, storedHashedHex) {
        const incomingHashHex = createHash(algorithm)
            .update(incomingToken)
            .digest(digest);

        const incomingBuffer = Buffer.from(incomingHashHex, 'utf8');
        const storedBuffer = Buffer.from(storedHashedHex, 'utf8');

        if (incomingBuffer.length !== storedBuffer.length) {
            return false;
        }

        return timingSafeEqual(incomingBuffer, storedBuffer);
    }
}
