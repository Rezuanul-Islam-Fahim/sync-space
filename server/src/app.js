import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import router from './common/router.js'
import { errorHandler } from './middlewares/error.handler.js'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import hpp from 'hpp'
import logger from './utils/logger.js'

const createApp = () => {
    const app = express()

    app.use((req, res, next) => {
        req.id = req.headers['x-request-id'] || uuidv4()
        res.setHeader('x-request-id', req.id)
        next()
    })

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
