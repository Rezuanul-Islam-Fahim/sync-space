export class TokenHasherPort {
    hash(_algorithm, _digest, _token) {
        throw new Error('Method not implemented');
    }
}

export class TokenHashComparerPort {
    compare(_algorith, _digest, _incomingToken, _storedHashedHex) {
        throw new Error('Method not implemented');
    }
}
