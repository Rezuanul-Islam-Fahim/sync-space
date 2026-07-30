export class UserFacade {
    constructor({ getUserUseCase, createUserUseCase }) {
        this.getUserUseCase = getUserUseCase;
        this.createUserUseCase = createUserUseCase;
    }

    getUser(id) {
        return this.getUserUseCase.execute('id', id);
    }

    getUserByAuthId(authId) {
        return this.getUserUseCase.execute('authId', authId);
    }

    createUser(data) {
        return this.createUserUseCase.execute(data);
    }
}
