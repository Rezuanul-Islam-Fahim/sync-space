import createApp from './app.js'
import { initDB } from './infra/db.js'
import config from './config/index.js'

const PORT = config.port || 3000

const start = async () => {
    await initDB()

    const app = createApp()

    app.listen(PORT, () => {
        console.log(`Server started on port: ${PORT}`)
    })
}

start()
    .catch(err => {
        console.log('Failed to start: ', err)
        process.exit(1)
    })