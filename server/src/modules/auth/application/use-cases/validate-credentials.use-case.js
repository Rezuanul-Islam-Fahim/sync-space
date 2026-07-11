export class ValidateCredentialsUseCase {
    constructor({ authUserReader, passwordHasher, logger }) {
        this.authUserReader = authUserReader;
        this.passwordHasher = passwordHasher;
        this.logger = logger;
    }

    async execute(data) {
        const user = await this.authUserReader.findByEmailWithPassword(
            data.email
        );

        if (!user) {
            return null;
        }

        const isPasswordMatch = await this.passwordHasher.compare(
            data.password,
            user.password
        );

        return isPasswordMatch ? user : null;
    }
}
