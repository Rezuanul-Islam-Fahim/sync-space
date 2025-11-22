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

export default config