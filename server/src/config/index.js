import dotenv from 'dotenv';
import { envSchema } from './env.schema.js';
import { parseCorsOrigins } from './cors.config.js';

let cachedConfig;

/**
 * Resets the cached configuration instance.
 * Intended for test isolation when process.env changes between tests.
 */
export const resetConfig = () => {
    cachedConfig = undefined;
};

/**
 * Retrieves the application configuration.
 *
 * @param {{ reload?: boolean }} [options]
 * @returns {object}
 */
export const getConfig = ({ reload = false } = {}) => {
    if (cachedConfig && !reload) {
        return cachedConfig;
    }

    dotenv.config();

    const { error, value: envVars } = envSchema.validate(process.env);

    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    const corsOrigins = parseCorsOrigins(envVars.CORS_ORIGINS);

    cachedConfig = {
        port: envVars.PORT,
        env: envVars.NODE_ENV,
        db: {
            uri: envVars.MONGODB_URI,
            maxPoolSize: envVars.MONGODB_MAX_POOL_SIZE,
            serverSelectionTimeoutMS: envVars.MONGODB_SELECTION_TIMEOUT_MS,
            socketTimeoutMS: envVars.MONGODB_SOCKET_TIMEOUT_MS,
        },
        logLevel: envVars.LOG_LEVEL,
        bodyLimit: envVars.BODY_LIMIT,
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

    return cachedConfig;
};
