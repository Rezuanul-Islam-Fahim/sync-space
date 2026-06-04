import AppError from '../common/app-error.js';
import { NOT_FOUND } from '../constants/http-status.js';

const unknownRoutesHandler = (req, res, next) => {
    next(new AppError(`Route: ${req.originalUrl} not found`, NOT_FOUND));
};

export default unknownRoutesHandler;
