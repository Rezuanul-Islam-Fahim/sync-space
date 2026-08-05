export class GetUserByAuthIdUseCase {
    constructor({ userReader, logger }) {
        this.userReader = userReader;
        this.logger = logger;
    }

    async execute(authId) {
        const user = await this.userReader.findByAuthId(authId);
        if (!user) {
            this.logger?.debug?.('User profile not found by authId', {
                authId,
            });
            return null;
        }
        return user;
    }
}
