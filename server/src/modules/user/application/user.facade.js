export class UserFacade {
    constructor({ createUserUseCase }) {
        this.createUserUseCase = createUserUseCase;
    }

    createUser(data) {
        return this.createUserUseCase.execute(data);
    }
}
