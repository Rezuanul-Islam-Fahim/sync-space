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
        return this.tokenVerifier.verifyAccessToken(token);
    }
}
