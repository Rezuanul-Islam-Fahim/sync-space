import { validationResult } from 'express-validator'

export const validate = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const error = new Error();
        error.statusCode = 400;
        error.error = errors.array();

        return next(error)
    }

    next()
}
