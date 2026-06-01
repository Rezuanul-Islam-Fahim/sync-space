import dotenv from 'dotenv'
import Joi from 'joi'

dotenv.config()

const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow('development', 'production')
        .default('development'),
    PORT: Joi.number().integer().default(3000),
    MONGODB_URI: Joi.string().required().description('Mongo DB url'),
    LOG_LEVEL: Joi.string()
        .allow('error', 'warn', 'info', 'http', 'debug')
        .default('debug'),
    BCRYPT_SALT_ROUNDS: Joi.number().integer().min(4).max(31).default(10),
    CORS_ORIGINS: Joi.string().trim().default('*')
}).unknown()

const { error, value: envVars } = envSchema.validate(process.env)

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const { error: cError, value: parsedCorsOrigins } = Joi.array()
    .items(Joi.alternatives(Joi.string().valid('*'), Joi.string().uri()))
    .default([])
    .validate(envVars.CORS_ORIGINS.split(',').map(e => e.trim()))

if (cError) {
    throw new Error(`Cors Origin validation error: ${cError.message}`)
}

if (parsedCorsOrigins.includes('*') && parsedCorsOrigins.length > 1) {
    throw new Error('Cors Origin validation error: "*" can not be combined with other origins')
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
    },
    corsOrigins:
        parsedCorsOrigins.length > 1 ? parsedCorsOrigins : parsedCorsOrigins[0]
}

export const isDev = () => config.env === 'development'

export default config
