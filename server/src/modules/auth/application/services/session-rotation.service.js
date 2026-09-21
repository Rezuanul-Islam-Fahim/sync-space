export class SessionRotationService {
    /**
     *
     * @param {{
     *   tokenGenerator: import('../ports/token-generator.port').TokenGeneratorPort
     *   sessionStore: import('../ports/session-store.port').SessionStorePort
     *   tokenHasher: import('../ports/token-hasher.port').TokenHasherPort
     *   tokenHashComparer: import('../ports/token-hasher.port').TokenHashComparerPort
     *   sessionRefreshLock: import('../ports/session-refresh-lock.port').SessionRefreshLockPort
     *   logger: import('../../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({
        tokenGenerator,
        sessionStore,
        tokenHasher,
        tokenHashComparer,
        sessionRefreshLock,
        logger,
    }) {
        this.tokenGenerator = tokenGenerator;
        this.sessionStore = sessionStore;
        this.tokenHasher = tokenHasher;
        this.sessionRefreshLock = sessionRefreshLock;
        this.tokenHashComparer = tokenHashComparer;
        this.logger = logger;
    }

    async validateSession() {}
}
