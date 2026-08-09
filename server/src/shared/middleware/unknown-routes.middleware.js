import { NotFoundError } from '../error/index.js';
import { ROUTE_NOT_FOUND } from '../constants/index.js';

const sanitizeUrl = (url = '') => {
    return String(url)
        .replace(/[\r\n\t\0]/g, '')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .slice(0, 200);
};

export const unknownRoutesHandler = (req, res, next) => {
    const safeUrl = sanitizeUrl(req.originalUrl);
    next(new NotFoundError(ROUTE_NOT_FOUND(safeUrl)));
};
