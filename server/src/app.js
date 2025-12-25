import express from 'express'
import router from './api/routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'

const createApp = () => {
    const app = express()

    app.use(express.json())

    app.use('/api', router)

    app.use(errorHandler)

    return app
}

export default createApp
