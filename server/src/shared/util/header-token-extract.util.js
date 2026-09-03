export const headerTokenExtract = authorization => {
    if (authorization && authorization.startsWith('Bearer')) {
        return authorization.split(' ')[1];
    }

    return null;
};
