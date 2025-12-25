import dotenv from 'dotenv'

dotenv.config()
const envVars = process.env

const config = {
    port: envVars.PORT,
    env: envVars.NODE_ENV,
    db: {
        uri: envVars.MONGODB_URI
    }
}

export const isDev = () => config.env === 'dev';

export default config