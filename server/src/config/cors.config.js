/**
 * Custom Joi validator for parsing and validating the CORS_ORIGINS environment variable.
 *
 * @param {string} value
 * @param {import('joi').CustomHelpers} helpers
 * @returns {string | string[]}
 */
export const corsOriginsValidator = (value, helpers) => {
    if (typeof value !== 'string') {
        return helpers.error('any.invalid');
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return helpers.error('string.empty');
    }

    const items = trimmed
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

    if (items.includes('*') && items.length > 1) {
        return helpers.message(
            'CORS_ORIGINS: "*" cannot be combined with other origins'
        );
    }

    if (items.length === 1 && items[0] === '*') {
        return '*';
    }

    for (const item of items) {
        let isValid = false;
        try {
            const url = new URL(item);
            isValid =
                (url.protocol === 'http:' || url.protocol === 'https:') &&
                url.origin === item;
        } catch {
            isValid = false;
        }

        if (!isValid) {
            return helpers.message(
                `CORS_ORIGINS contains an invalid origin URI: "${item}". Origins must follow the format "http(s)://host[:port]" without path or trailing slash.`
            );
        }
    }

    return items;
};
