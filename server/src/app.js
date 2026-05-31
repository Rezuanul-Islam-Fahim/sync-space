import express from 'express'
import router from './common/router.js'
import { errorHandler } from './middlewares/error.handler.js'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import hpp from 'hpp'
import logger from './utils/logger.js'

const createApp = () => {
    const app = express()

    app.use(helmet())
    app.use(cors())
    app.use(hpp())
    app.use(morgan('combined', { stream: logger.stream }))
    app.use(express.json())

    app.use('/api', router)

    app.use(errorHandler)

    return app
}

export default createApp
