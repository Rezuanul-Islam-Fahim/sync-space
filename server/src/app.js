import express from 'express'
import router from './routes/index.js'
import { errorHandler } from './middlewares/error-handler.middleware.js'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import hpp from 'hpp'
import logger from './utils/logger.js'
import requestIdAttach from './middlewares/request-id.middleware.js'
import corsConfig from './config/cors.js'

const createApp = () => {
    const app = express()

    app.use(requestIdAttach)
    app.use(helmet())
    app.use(cors(corsConfig))
    app.use(hpp())
    app.use(morgan('combined', { stream: logger.stream }))
    app.use(express.json())

    app.use('/api', router)

    app.use(errorHandler)

    return app
}

export default createApp
