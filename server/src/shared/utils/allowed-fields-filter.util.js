const allowedFieldsFilter = (body, allowedFields) =>
    allowedFields.reduce((obj, field) => {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
            obj[field] = body[field];
        }
        return obj;
    }, {});

export default allowedFieldsFilter;
