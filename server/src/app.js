import express from 'express'
import router from './api/routes/index.js'
import { errorHandler } from './middlewares/error-handler.js'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import { isDev } from './config/index.js'
import hpp from 'hpp'

const createApp = () => {
    const app = express()

    app.use(morgan(isDev() ? 'dev' : 'combined'))
    app.use(helmet())
    app.use(cors())
    app.use(hpp())
    app.use(express.json())

    app.use('/api', router)

    app.use(errorHandler)

    return app
}

export default createApp
