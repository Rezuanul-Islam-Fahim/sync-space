import Joi from 'joi';

export const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production')
        .default('development'),
    PORT: Joi.number().integer().default(3000),
    MONGODB_URI: Joi.string().required().description('Mongo DB url'),
    LOG_LEVEL: Joi.string()
        .valid('error', 'warn', 'info', 'http', 'debug')
        .default('debug'),
    BCRYPT_SALT_ROUNDS: Joi.number().integer().min(4).max(31).default(10),
    MONGODB_MAX_POOL_SIZE: Joi.number().integer().min(1).default(10),
    MONGODB_SELECTION_TIMEOUT_MS: Joi.number().integer().min(0).default(5000),
    MONGODB_SOCKET_TIMEOUT_MS: Joi.number().integer().min(0).default(45000),
    CORS_ORIGINS: Joi.string().trim().default('*'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_EXPIRES_IN: Joi.string()
        .default('15m')
        .description('JWT token expiration time'),
    JWT_REFRESH_SECRET: Joi.string()
        .required()
        .description('JWT refresh secret key'),
    JWT_REFRESH_EXPIRES_IN: Joi.string()
        .default('7d')
        .description('Jwt refresh token expiration time'),
}).unknown();
