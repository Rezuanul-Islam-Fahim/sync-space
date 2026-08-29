// Domain-level auth error and status messages
export const INVALID_CREDENTIALS = 'Invalid Email or Password';
export const EMAIL_ALREADY_REGISTERED =
    'User with this email is already registered';
export const DUMMY_PASSWORD_HASH =
    '$2b$12$e8wqrwK6f5t3g7e8r9t0yu1234567890123456789012345678901';

// Token / authentication messages
export const TOKEN_NOT_FOUND = 'Authentication token is missing. Please log in';
export const INVALID_TOKEN = 'Invalid or expired authentication token';
export const TOKEN_EXPIRED = 'Authentication token has expired';
export const USER_UNAVAILABLE =
    'The user belonging to this token no longer exists';
export const TOKEN_VERIFICATION_FAILED = 'Token verification failed';

// Cache keys and ttl's
export const authSessionCacheKey = 'session';
export const authSessionTimeToLive = 7 * 24 * 60 * 60;
