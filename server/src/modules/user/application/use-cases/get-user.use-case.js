export class GetUserUseCase {
    constructor({ userReader, logger }) {
        this.userReader = userReader;
        this.logger = logger;
    }


    async byUsername(username) {
        return this.userReader.findByUsername(username);
    }

    async byId(id) {
        return this.userReader.findById(id);
    }
}
