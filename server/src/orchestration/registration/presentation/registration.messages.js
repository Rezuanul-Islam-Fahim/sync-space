import {
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
} from '../../../shared/constants/index.js';

export const USER_CREATED = 'New user created successfully';
export const USERNAME_REQUIRED = 'Username is required';
export const USERNAME_LENGTH_ERROR = `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`;
export const DISPLAY_NAME_INVALID = 'Display Name must be a valid string';
export const DOB_REQUIRED = 'Date-of-birth is required';
export const DOB_INVALID = 'Enter a valid date (YYYY-MM-DD)';
