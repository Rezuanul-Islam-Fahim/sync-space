import dotenv from 'dotenv';
import { envSchema } from './env.schema.js';
import { parseCorsOrigins } from './cors.config.js';

dotenv.config();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

// Parse CORS origins once and derive corsCredentials from the same result
// (previously parseCorsOrigins was called twice — Issue 12).
const corsOrigins = parseCorsOrigins(envVars.CORS_ORIGINS);

export const config = {
    port: envVars.PORT,
    env: envVars.NODE_ENV,
    db: {
        uri: envVars.MONGODB_URI,
        maxPoolSize: envVars.MONGODB_MAX_POOL_SIZE,
        serverSelectionTimeoutMS: envVars.MONGODB_SELECTION_TIMEOUT_MS,
        socketTimeoutMS: envVars.MONGODB_SOCKET_TIMEOUT_MS,
    },
    logLevel: envVars.LOG_LEVEL,
    auth: {
        saltRounds: envVars.BCRYPT_SALT_ROUNDS,
    },
    corsOrigins,
    corsCredentials: corsOrigins !== '*',
    jwt: {
        secret: envVars.JWT_SECRET,
        expiresIn: envVars.JWT_EXPIRES_IN,
        refreshSecret: envVars.JWT_REFRESH_SECRET,
        refreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
    },
};

export const isDev = () => config.env === 'development';
