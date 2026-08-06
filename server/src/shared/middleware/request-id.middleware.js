import { v4 as uuidv4 } from 'uuid';

// Validates alphanumeric, hyphen, and underscore characters up to 64 characters
const REQUEST_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

/**
 * Validates and sanitizes incoming request ID header.
 * Ignores malformed, control-character-laden, or excessively long headers.
 *
 * @param {string|string[]} header
 * @returns {string|null}
 */
const sanitizeRequestId = header => {
    if (!header) return null;
    const value = Array.isArray(header) ? header[0] : header;
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (REQUEST_ID_REGEX.test(trimmed)) {
            return trimmed;
        }
    }
    return null;
};

/**
 * Middleware that generates an un-spoofable, cryptographically strong UUIDv4
 * request ID for server-side request tracing and logging.
 *
 * Incoming client `x-request-id` headers are sanitized and attached to `req.clientRequestId`
 * for upstream correlation, but never override the server-generated `req.id`.
 */
export const requestIdAttach = (req, res, next) => {
    const incomingHeader = req.headers['x-request-id'];
    const clientRequestId = sanitizeRequestId(incomingHeader);

    req.id = uuidv4();
    if (clientRequestId) {
        req.clientRequestId = clientRequestId;
    }

    res.setHeader('x-request-id', req.id);
    next();
};
