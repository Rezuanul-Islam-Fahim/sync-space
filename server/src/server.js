import createApp from './app.js'
import { initDB, closeDB } from './infra/db.js'
import config from './config/index.js'

const PORT = config.port

const start = async () => {
    await initDB()
    const app = createApp()

    const server = app.listen(PORT, () => {
        console.log(`Server started on port: ${PORT}`)
    })

    const shutdown = async (signal) => {
        console.log(`\n\'${signal}\' received. Shutting down gracefully...`)

        // Stop accepting new connections
        server.close(async () => {
            try {
                await closeDB()
                process.exit(0)
            } catch (err) {
                console.error('Error during shutdown:', err)
                process.exit(1)
            }
        })

        setTimeout(() => {
            console.error('Forced shutdown due to timeout.')
            process.exit(1)
        }, 30000)
    }

    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)
}

start()
    .catch(err => {
        console.error('Failed to start:', err)
        process.exit(1)
    })
