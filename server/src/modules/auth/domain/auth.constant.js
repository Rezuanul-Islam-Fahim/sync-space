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

export const EMAIL_ALREADY_REGISTERED =
    'User with this email is already registered';
export const USERNAME_ALREADY_TAKEN = 'Username is already taken';
