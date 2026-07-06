import AppError from '../errors/app.error.js';

const unknownRoutesHandler = (req, res, next) => {
    next(new AppError(`Route: ${req.originalUrl} not found`, 'NOT_FOUND'));
};

export default unknownRoutesHandler;
