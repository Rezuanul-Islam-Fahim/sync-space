import { AppError, ErrorCode } from '../../../../shared/error/index.js';

export class GetUserUseCase {
    constructor({ userReader, logger }) {
        this.userReader = userReader;
        this.logger = logger;
    }

    async execute(by, value) {
        let user;
        if (by === 'id') {
            user = await this.userReader.findById(value);
        } else if (by === 'username') {
            user = await this.userReader.findByUsername(value);
        } else if (by === 'email') {
            user = await this.userReader.findByEmail(value);
        } else {
            // Throw an operational AppError so the error handler returns a
            // 400 response instead of treating this as a critical error and
            // triggering a graceful shutdown.
            throw new AppError(
                `Invalid search criteria: "${by}"`,
                ErrorCode.INVALID_INPUT
            );
        }

        if (!user) {
            throw new AppError('User not found', ErrorCode.RESOURCE_NOT_FOUND);
        }

        return user;
    }
}
