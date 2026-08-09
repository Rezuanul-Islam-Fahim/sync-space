export class GetUserByUsernameUseCase {
    constructor({ userReader, logger }) {
        this.userReader = userReader;
        this.logger = logger;
    }

    async execute(username) {
        const user = await this.userReader.findByUsername(username);
        if (!user) {
            this.logger?.debug?.('User profile not found by username', {
                username,
            });
            return null;
        }
        return user;
    }
}
