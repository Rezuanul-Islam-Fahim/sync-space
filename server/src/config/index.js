import dotenv from 'dotenv';
import { envSchema } from './env.schema.js';
import { parseCorsOrigins } from './cors.config.js';

dotenv.config();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
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
    corsOrigins: parseCorsOrigins(envVars.CORS_ORIGINS),
    jwt: {
        secret: envVars.JWT_SECRET,
        expiresIn: envVars.JWT_EXPIRES_IN,
        refreshSecret: envVars.JWT_REFRESH_SECRET,
        refreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
    },
};

export const isDev = () => config.env === 'development';

export default config;
