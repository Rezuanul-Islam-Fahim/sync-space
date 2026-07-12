export class GetUserUseCase {
    constructor({ userReader, logger }) {
        this.userReader = userReader;
        this.logger = logger;
    }

    /**
     * Returns the full `User` domain object (including hashed password)
     * for internal credential validation.  Never expose this to a response DTO.
     */
    async byEmailWithCredentials(email) {
        return this.userReader.findByEmailWithPassword(email);
    }

    async byUsername(username) {
        return this.userReader.findByUsername(username);
    }

    async byId(id) {
        return this.userReader.findById(id);
    }
}
