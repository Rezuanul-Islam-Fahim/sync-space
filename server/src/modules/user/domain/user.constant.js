export const UserStatus = Object.freeze({
    ONLINE: 'online',
    OFFLINE: 'offline',
    IDLE: 'idle',
    DND: 'dnd',
});

export const USER_STATUS = Object.values(UserStatus);

export const BANNER_DEFAULT_COLOR = '#5865F2';
export const USER_NOT_FOUND = 'User not found';
export const PROFILE_ALREADY_EXISTS = 'Profile already exists';
export const USERNAME_ALREADY_TAKEN = 'Username is already taken';
export const INVALID_SEARCH_CRITERIA = by => `Invalid search criteria: "${by}"`;
