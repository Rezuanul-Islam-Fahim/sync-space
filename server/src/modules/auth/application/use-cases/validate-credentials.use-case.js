export class ValidateCredentialsUseCase {
    constructor({ authUserReader, passwordHasher }) {
        if (typeof authUserReader?.findByEmailWithPassword !== 'function') {
            throw new Error(
                'ValidateCredentialsUseCase: authUserReader must implement findByEmailWithPassword method'
            );
        }
        if (typeof passwordHasher?.compare !== 'function') {
            throw new Error(
                'ValidateCredentialsUseCase: passwordHasher must implement compare method'
            );
        }
        this.authUserReader = authUserReader;
        this.passwordHasher = passwordHasher;
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
