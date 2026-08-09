/**
 * Masks an email address for safe, PII-compliant logging.
 * Example: "john.doe@example.com" -> "j***e@example.com"
 *
 * @param {string} email
 * @returns {string}
 */
export const maskEmail = email => {
    if (!email || typeof email !== 'string') return '[REDACTED]';
    const atIndex = email.indexOf('@');
    if (atIndex <= 0) return '[REDACTED]';

    const local = email.slice(0, atIndex);
    const domain = email.slice(atIndex);

    const maskedLocal =
        local.length > 2
            ? `${local[0]}***${local[local.length - 1]}`
            : `${local[0]}***`;

    return `${maskedLocal}${domain}`;
};
