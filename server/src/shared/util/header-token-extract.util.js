/**
 * Extracts a Bearer token from the authorization header.
 *
 * @param {string | undefined} authorization - The authorization header value.
 * @returns {string | null} The extracted token, or null if invalid or missing.
 */
export const headerTokenExtract = authorization => {
    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.slice(7).trim();
        return token || null;
    }

    return null;
};
