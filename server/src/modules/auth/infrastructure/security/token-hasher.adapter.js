import { createHash } from 'node:crypto';
import { TokenHasherPort } from '../../application/ports/token-hasher.port.js';

export class TokenHasherAdapter extends TokenHasherPort {
    hash(algorithm, digest, token) {
        return createHash(algorithm).update(token).digest(digest);
    }
}
