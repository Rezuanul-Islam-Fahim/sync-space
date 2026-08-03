export class AuthFacade {
    constructor({ registerUserUseCase, deleteAuthUserUseCase, tokenVerifier }) {
        this.registerUserUseCase = registerUserUseCase;
        this.deleteAuthUserUseCase = deleteAuthUserUseCase;
        this.tokenVerifier = tokenVerifier;
    }

    registerUser(data) {
        return this.registerUserUseCase.execute(data);
    }

    deleteAuthUser(id) {
        return this.deleteAuthUserUseCase.execute(id);
    }

    verifyAccessToken(token) {
        // Map the token payload to an intent-revealing principal object so
        // callers do not rely on JWT internals (e.g., `sub` claim).
        const decoded = this.tokenVerifier.verifyAccessToken(token);
        return { id: decoded.sub, email: decoded.email };
    }
}
