import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const generateToken = (userId, email) => {
    const payload = { sub: userId, email };

    const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
    });

    return { token, refreshToken };
};
