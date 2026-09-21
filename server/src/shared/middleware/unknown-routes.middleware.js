import { NotFoundError } from '../error/index.js';
import { ROUTE_NOT_FOUND } from '../constants/index.js';

/**
 * Sanitizes the request URL for safe inclusion in error messages.
 *
 * @param {string} [url='']
 * @returns {string}
 */
const sanitizeUrl = (url = '') => {
    return String(url)
        .replace(/[\r\n\t\0]/g, '')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .slice(0, 200);
};

/**
 * Catch-all middleware for unhandled route paths (404 Not Found).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const unknownRoutesHandler = (req, res, next) => {
    const safeUrl = sanitizeUrl(req.originalUrl);
    next(new NotFoundError(ROUTE_NOT_FOUND(safeUrl)));
};
