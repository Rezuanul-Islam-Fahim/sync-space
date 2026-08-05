import Joi from 'joi';
import { corsOriginsValidator } from './cors.config.js';

export const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production')
        .default('development'),
    PORT: Joi.number().integer().default(3000),
    MONGODB_URI: Joi.string().required().description('MongoDB url'),
    LOG_LEVEL: Joi.string()
        .valid('error', 'warn', 'info', 'http', 'debug')
        .default('debug'),
    BCRYPT_SALT_ROUNDS: Joi.number().integer().min(4).max(31).default(10),
    BODY_LIMIT: Joi.string()
        .default('10kb')
        .description('Request body size limit'),
    MONGODB_MAX_POOL_SIZE: Joi.number().integer().min(1).default(10),
    MONGODB_SELECTION_TIMEOUT_MS: Joi.number().integer().min(0).default(5000),
    MONGODB_SOCKET_TIMEOUT_MS: Joi.number().integer().min(0).default(45000),
    CORS_ORIGINS: Joi.string()
        .default('*')
        .custom(corsOriginsValidator, 'CORS origins validation and parsing'),
    TRUST_PROXY: Joi.boolean()
        .default(false)
        .description('Trust proxy headers (X-Forwarded-For)'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_EXPIRES_IN: Joi.string()
        .default('15m')
        .description('JWT token expiration time'),
    JWT_REFRESH_SECRET: Joi.string()
        .required()
        .description('JWT refresh secret key'),
    JWT_REFRESH_EXPIRES_IN: Joi.string()
        .default('7d')
        .description('JWT refresh token expiration time'),
}).unknown();
