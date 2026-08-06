import { envSchema } from './env.schema.js';

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

    const { error, value: envVars } = envSchema.validate(process.env);

    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    const rawCorsOrigins = envVars.CORS_ORIGINS;
    const corsOrigins = Array.isArray(rawCorsOrigins)
        ? Object.freeze([...rawCorsOrigins])
        : rawCorsOrigins;

    cachedConfig = Object.freeze({
        port: envVars.PORT,
        env: envVars.NODE_ENV,
        db: Object.freeze({
            uri: envVars.MONGODB_URI,
            maxPoolSize: envVars.MONGODB_MAX_POOL_SIZE,
            serverSelectionTimeoutMS: envVars.MONGODB_SELECTION_TIMEOUT_MS,
            socketTimeoutMS: envVars.MONGODB_SOCKET_TIMEOUT_MS,
            autoIndex: envVars.NODE_ENV !== 'production',
        }),
        logLevel: envVars.LOG_LEVEL,
        bodyLimit: envVars.BODY_LIMIT,
        auth: Object.freeze({
            saltRounds: envVars.BCRYPT_SALT_ROUNDS,
        }),
        corsOrigins,
        corsCredentials: corsOrigins !== '*',
        trustProxy: envVars.TRUST_PROXY,
        jwt: Object.freeze({
            algorithm: envVars.JWT_ALGORITHM,
            secret: envVars.JWT_SECRET,
            expiresIn: envVars.JWT_EXPIRES_IN,
            refreshSecret: envVars.JWT_REFRESH_SECRET,
            refreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
        }),
    });

    return cachedConfig;
};
