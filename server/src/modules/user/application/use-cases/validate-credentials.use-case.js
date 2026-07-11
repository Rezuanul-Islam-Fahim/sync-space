export class ValidateCredentialsUseCase {
    constructor({ userReader, passwordHasher }) {
        if (typeof userReader?.findByEmailWithPassword !== 'function') {
            throw new Error(
                'ValidateCredentialsUseCase: userReader must implement findByEmailWithPassword method'
            );
        }
        if (typeof passwordHasher?.compare !== 'function') {
            throw new Error(
                'ValidateCredentialsUseCase: passwordHasher must implement compare method'
            );
        }
        this.userReader = userReader;
        this.passwordHasher = passwordHasher;
    }


    async execute(data) {
        const user = await this.userReader.findByEmailWithPassword(data.email);

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
