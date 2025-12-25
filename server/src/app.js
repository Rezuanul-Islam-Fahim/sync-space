import express from 'express'
import router from './api/routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'
import helmet from 'helmet'
import cors from 'cors'

const createApp = () => {
    const app = express()

    app.use(helmet())
    app.use(cors())
    app.use(express.json())

    app.use('/api', router)

    app.use(errorHandler)

    return app
}

export default createApp
