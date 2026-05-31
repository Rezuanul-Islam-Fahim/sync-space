import dotenv from 'dotenv'
import Joi from 'joi'

dotenv.config()

const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow('development', 'production')
        .default('development'),
    PORT: Joi.number().default(3000),
    MONGODB_URI: Joi.string().required().description('Mongo DB url'),
    LOG_LEVEL: Joi.string()
        .allow('error', 'warn', 'info', 'http', 'debug')
        .default('debug'),
    BCRYPT_SALT_ROUNDS: Joi.number().integer().min(4).max(31).default(10)
}).unknown()

const { error, value: envVars } = envSchema.validate(process.env)

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const config = {
    port: envVars.PORT,
    env: envVars.NODE_ENV,
    db: {
        uri: envVars.MONGODB_URI
    },
    logLevel: envVars.LOG_LEVEL,
    auth: {
        saltRounds: envVars.BCRYPT_SALT_ROUNDS
    }
}

export const isDev = () => config.env === 'development';

export default config
