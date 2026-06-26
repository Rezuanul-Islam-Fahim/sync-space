import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production')
        .default('development'),
    PORT: Joi.number().integer().default(3000),
    MONGODB_URI: Joi.string().required().description('Mongo DB url'),
    LOG_LEVEL: Joi.string()
        .valid('error', 'warn', 'info', 'http', 'debug')
        .default('debug'),
    BCRYPT_SALT_ROUNDS: Joi.number().integer().min(4).max(31).default(10),
    CORS_ORIGINS: Joi.string().trim().default('*'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_EXPIRES_IN: Joi.string()
        .required()
        .description('JWT token expiration time'),
    JWT_REFRESH_SECRET: Joi.string()
        .required()
        .description('JWT refresh secret key'),
    JWT_REFRESH_EXPIRES_IN: Joi.string()
        .required()
        .description('Jwt refresh token expiration time'),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const { error: cError, value: parsedCorsOrigins } = Joi.array()
    .items(Joi.alternatives(Joi.string().valid('*'), Joi.string().uri()))
    .default([])
    .validate(envVars.CORS_ORIGINS.split(',').map(e => e.trim()));

if (cError) {
    throw new Error(`Cors Origin validation error: ${cError.message}`);
}

if (parsedCorsOrigins.includes('*') && parsedCorsOrigins.length > 1) {
    throw new Error(
        'Cors Origin validation error: "*" can not be combined with other origins'
    );
}

const config = {
    port: envVars.PORT,
    env: envVars.NODE_ENV,
    db: {
        uri: envVars.MONGODB_URI,
    },
    logLevel: envVars.LOG_LEVEL,
    auth: {
        saltRounds: envVars.BCRYPT_SALT_ROUNDS,
    },
    corsOrigins:
        parsedCorsOrigins.length > 1 ? parsedCorsOrigins : parsedCorsOrigins[0],
    jwt: {
        secret: envVars.JWT_SECRET,
        expiresIn: envVars.JWT_EXPIRES_IN,
        refreshSecret: envVars.JWT_REFRESH_SECRET,
        refreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
    },
};

export const isDev = () => config.env === 'development';

export default config;
