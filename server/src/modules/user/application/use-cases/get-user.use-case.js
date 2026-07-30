import { AppError, ErrorCode } from '../../../../shared/error/index.js';
import {
    INVALID_SEARCH_CRITERIA,
    USER_NOT_FOUND,
} from '../../domain/user.constant.js';

export class GetUserUseCase {
    constructor({ userReader, logger }) {
        this.userReader = userReader;
        this.logger = logger;
    }

    async execute(by, value) {
        let criteria;

        if (typeof by === 'object' && by !== null) {
            criteria = by;
        } else if (by && value) {
            criteria = { [by]: value };
        } else {
            // Throw an operational AppError so the error handler returns a
            // 400 response instead of treating this as a critical error and
            // triggering a graceful shutdown.
            throw new AppError(
                INVALID_SEARCH_CRITERIA(by),
                ErrorCode.INVALID_INPUT
            );
        }

        const user = await this.userReader.findOne(criteria);

        if (!user) {
            throw new AppError(USER_NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND);
        }

        return user;
    }
}
