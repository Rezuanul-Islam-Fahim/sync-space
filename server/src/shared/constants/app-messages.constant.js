export const DEFAULT_SUCCESS = 'OK';
export const DEFAULT_ERROR = 'Internal Server Error';

export const USER_CREATED = 'New user created successfully';
export const LOGIN_SUCCESSFUL = 'Login successful';

// Auth & Service messages
export const EMAIL_ALREADY_REGISTERED =
    'User with this email is already registered';
export const USERNAME_ALREADY_TAKEN = 'Username is already taken';
export const INVALID_CREDENTIALS = 'Invalid Email or Password';
export const TOKEN_NOT_FOUND = 'Authentication token is missing. Please log in';
export const INVALID_TOKEN = 'Invalid or expired authentication token';
export const USER_UNAVAILABLE =
    'The user belonging to this token no longer exists';

// Validation messages
export const EMAIL_REQUIRED = 'Email is required';
export const EMAIL_INVALID = 'Email must be valid';
export const USERNAME_REQUIRED = 'Username is required';
export const USERNAME_LENGTH_ERROR =
    'Username must be between 3 and 30 characters';
export const PASSWORD_REQUIRED = 'Password is required';
export const PASSWORD_LENGTH_ERROR = 'Password must be at least 6 characters';
export const DISPLAY_NAME_INVALID = 'Display Name must be a valid string';
export const DOB_REQUIRED = 'Date-of-birth is required';
export const DOB_INVALID = 'Enter a valid date (YYYY-MM-DD)';

// Database / infrastructure error messages
export const DUPLICATE_FIELD_VALUE = field =>
    `An account with this ${field} already exists`;
export const INVALID_ID = 'Invalid resource identifier';
