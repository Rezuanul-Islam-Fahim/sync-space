export const REGISTER_ALLOWED_FIELDS = [
    'email',
    'username',
    'password',
    'displayName',
    'dateOfBirth',
];

export const LOGIN_ALLOWED_FIELDS = ['email', 'password'];

// Auth & Service messages
export const INVALID_CREDENTIALS = 'Invalid Email or Password';
export const TOKEN_NOT_FOUND = 'Authentication token is missing. Please log in';
export const INVALID_TOKEN = 'Invalid or expired authentication token';
export const USER_UNAVAILABLE =
    'The user belonging to this token no longer exists';
