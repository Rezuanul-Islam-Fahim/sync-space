import Joi from 'joi';

export const parseCorsOrigins = originsStr => {
    const { error, value: parsedCorsOrigins } = Joi.array()
        .items(Joi.alternatives(Joi.string().valid('*'), Joi.string().uri()))
        .default([])
        .validate(originsStr.split(',').map(e => e.trim()));

    if (error) {
        throw new Error(`Cors Origin validation error: ${error.message}`);
    }

    if (parsedCorsOrigins.includes('*') && parsedCorsOrigins.length > 1) {
        throw new Error(
            'Cors Origin validation error: "*" can not be combined with other origins'
        );
    }

    if (parsedCorsOrigins.length === 1 && parsedCorsOrigins[0] === '*') {
        return '*';
    }

    return parsedCorsOrigins;
};
