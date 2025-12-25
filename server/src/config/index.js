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
        .default('debug')
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
    LOG_LEVEL: envVars.LOG_LEVEL
}

export const isDev = () => config.env === 'development';

export default config
