export class RegisterUserUseCase {
    constructor({ authUserWriter, passwordHasher, logger }) {
        if (typeof authUserWriter?.createUser !== 'function') {
            throw new Error(
                'RegisterUserUseCase: authUserWriter must implement createUser method'
            );
        }
        if (typeof passwordHasher?.hash !== 'function') {
            throw new Error(
                'RegisterUserUseCase: passwordHasher must implement hash method'
            );
        }
        this.authUserWriter = authUserWriter;
        this.passwordHasher = passwordHasher;
        this.logger = logger;
    }

    async execute(data) {
        const hashedPassword = await this.passwordHasher.hash(data.password);
        return this.authUserWriter.createUser({
            ...data,
            password: hashedPassword,
        });
    }
}
