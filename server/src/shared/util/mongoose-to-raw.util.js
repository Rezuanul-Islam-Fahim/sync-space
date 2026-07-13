export const toRawObject = value => {
    if (!value) return null;

    return typeof value.toObject === 'function' ? value.toObject() : value;
};
