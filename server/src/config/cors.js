import config from './index.js'

const corsOrigins = config.corsOrigins

export default {
    origin: corsOrigins,
    credentials: corsOrigins !== '*'
}
