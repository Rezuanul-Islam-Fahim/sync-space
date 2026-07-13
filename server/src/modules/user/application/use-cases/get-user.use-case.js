import { AppError, ErrorCode } from '../../../../shared/index.js';

export class GetUserUseCase {
    constructor({ userReader, logger }) {
        this.userReader = userReader;
        this.logger = logger;
    }

    async execute({ by, value }) {
        let user;
        if (by === 'id') {
            user = await this.userReader.findById(value);
        } else if (by === 'username') {
            user = await this.userReader.findByUsername(value);
        } else {
            throw new Error(`Invalid search criteria: ${by}`);
        }

        if (!user) {
            throw new AppError('User not found', ErrorCode.RESOURCE_NOT_FOUND);
        }

        return user;
    }
}
