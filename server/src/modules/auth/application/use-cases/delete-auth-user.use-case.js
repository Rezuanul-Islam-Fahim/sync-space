export class DeleteAuthUserUseCase {
    constructor({ authUserWriter, logger }) {
        this.authUserWriter = authUserWriter;
        this.logger = logger;
    }

    async execute(id) {
        await this.authUserWriter.deleteById(id);
    }
}
