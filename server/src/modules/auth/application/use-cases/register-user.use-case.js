export class RegisterUserUseCase {
    constructor({ authUserWriter, passwordHasher, logger }) {
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
