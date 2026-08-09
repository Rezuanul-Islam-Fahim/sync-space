export class GetUserByIdUseCase {
    constructor({ userReader, logger }) {
        this.userReader = userReader;
        this.logger = logger;
    }

    async execute(id) {
        const user = await this.userReader.findById(id);
        if (!user) {
            this.logger?.debug?.('User profile not found by ID', { id });
            return null;
        }
        return user;
    }
}
