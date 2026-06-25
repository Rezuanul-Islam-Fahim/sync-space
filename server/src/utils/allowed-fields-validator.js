import { body } from 'express-validator';

const allowedFieldsValidator = fields =>
    body().custom(payload => {
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
            throw new Error('Request body must be an object');
        }

        const unknownFields = Object.keys(payload).filter(
            key => !fields.includes(key)
        );

        if (unknownFields.length > 0) {
            throw new Error(`Unknown field(s): ${unknownFields.join(', ')}`);
        }

        return true;
    });

export default allowedFieldsValidator;
