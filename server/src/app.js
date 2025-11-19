import express from 'express'
import router from './api/routes/index.js'

const createApp = () => {
    const app = express()
    app.use('/api', router)

    return app
}

export default createApp