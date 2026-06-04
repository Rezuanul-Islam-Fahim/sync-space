import { validationResult } from 'express-validator';
import AppError from '../common/app-error.js';
import { BAD_REQUEST } from '../constants/http-status.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const messageStr = errors
            .array()
            .map(obj => `${obj.msg}.`)
            .join(' ');
        const error = new AppError(messageStr, BAD_REQUEST, errors.array());

        return next(error);
    }

    next();
};

export default validate;
