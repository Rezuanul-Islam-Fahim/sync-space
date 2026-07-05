const allowedFieldsFilter = (body, allowedFields) => {
    if (!body || typeof body !== 'object') {
        return {};
    }

    return allowedFields.reduce((obj, field) => {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
            obj[field] = body[field];
        }
        return obj;
    }, {});
};

export default allowedFieldsFilter;
