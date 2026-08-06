import { NotFoundError } from '../error/index.js';
import { ROUTE_NOT_FOUND } from '../constants/index.js';

export const unknownRoutesHandler = (req, res, next) => {
    next(new NotFoundError(ROUTE_NOT_FOUND(req.originalUrl)));
};
