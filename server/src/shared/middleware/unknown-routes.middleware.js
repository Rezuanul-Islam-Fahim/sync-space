import { AppError, ErrorCode } from '../error/index.js';
import { ROUTE_NOT_FOUND } from '../constant/index.js';

export const unknownRoutesHandler = (req, res, next) => {
    next(
        new AppError(
            ROUTE_NOT_FOUND(req.originalUrl),
            ErrorCode.RESOURCE_NOT_FOUND
        )
    );
};
