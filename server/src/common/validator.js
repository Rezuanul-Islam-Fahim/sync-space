import { validationResult } from 'express-validator'
import AppError from '../utils/app.error.js'

export const validate = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const messageStr = errors
            .array()
            .map(obj => `${obj.msg}.`)
            .join(' ')
        const error = new AppError(messageStr, 400, errors.array())

        return next(error)
    }

    next()
}
