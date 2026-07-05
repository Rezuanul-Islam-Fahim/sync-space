import { PasswordHasherPort } from '../../../../shared/index.js';
import { UserReaderPort } from '../../index.js';

export class ValidateCredentialsUseCase {
    constructor({ userReader, passwordHasher }) {
        if (!(userReader instanceof UserReaderPort)) {
            throw new Error(
                'ValidateCredentialsUseCase: userReader must implement UserReaderPort'
            );
        }
        if (!(passwordHasher instanceof PasswordHasherPort)) {
            throw new Error(
                'ValidateCredentialsUseCase: passwordHasher must implement PasswordHasherPort'
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
