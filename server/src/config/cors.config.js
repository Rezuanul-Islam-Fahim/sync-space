import Joi from 'joi';

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
        const { error } = Joi.string().uri().validate(item);
        if (error) {
            return helpers.message(
                `CORS_ORIGINS contains an invalid origin URI: "${item}"`
            );
        }
    }

    return items;
};
