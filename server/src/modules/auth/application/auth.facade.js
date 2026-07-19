export class AuthFacade {
    constructor({ registerUserUseCase, deleteAuthUserUseCase }) {
        this.registerUserUseCase = registerUserUseCase;
        this.deleteAuthUserUseCase = deleteAuthUserUseCase;
    }

    registerUser(data) {
        return this.registerUserUseCase.execute(data);
    }

    deleteAuthUser(id) {
        return this.deleteAuthUserUseCase.execute(id);
    }
}
