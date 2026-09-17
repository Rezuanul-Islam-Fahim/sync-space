/**
 * Extracts a Bearer token from the authorization header.
 *
 * @param {string | undefined} authorization - The authorization header value.
 * @returns {string | null} The extracted token, or null if invalid or missing.
 */
export const headerTokenExtract = authorization => {
    if (authorization && authorization.startsWith('Bearer')) {
        return authorization.split(' ')[1];
    }

    return null;
};
