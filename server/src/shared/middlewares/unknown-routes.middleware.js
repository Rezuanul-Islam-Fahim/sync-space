import AppError from '../errors/app.error.js';
import { NOT_FOUND } from '../../constants/index.js';

const unknownRoutesHandler = (req, res, next) => {
    next(new AppError(`Route: ${req.originalUrl} not found`, NOT_FOUND));
};

export default unknownRoutesHandler;
