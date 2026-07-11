export class RegisterUserUseCase {
    constructor({ authUserWriter }) {
        if (typeof authUserWriter?.createUser !== 'function') {
            throw new Error(
                'RegisterUserUseCase: authUserWriter must implement createUser method'
            );
        }
        this.authUserWriter = authUserWriter;
    }

    async execute(data) {
        return this.authUserWriter.createUser(data);
    }
}
