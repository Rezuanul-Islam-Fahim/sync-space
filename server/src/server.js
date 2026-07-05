import { initDB, closeDB } from './shared/infrastructure/database/index.js';
import config from './config/index.js';
import logger from './shared/infrastructure/logging/logger.js';
import { composeDependencies } from './composition-root.js';

const PORT = config.port;

const start = async () => {
    await initDB({ logger });

    const { app } = composeDependencies({ logger });

    const server = app.listen(PORT, () => {
        logger.info(`Server started on port: ${PORT}`);
    });

    const shutdown = signal => {
        logger.info(`\n'${signal}' received. Shutting down gracefully...`);

        // Stop accepting new connections
        server.close(async () => {
            try {
                await closeDB();
                process.exit(0);
            } catch (err) {
                logger.error('Error during shutdown:', err);
                process.exit(1);
            }
        });

        setTimeout(() => {
            logger.error('Forced shutdown due to timeout.');
            process.exit(1);
        }, 30000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    process.on('unhandledRejection', reason => {
        logger.error('Unhandled Rejection: ', reason);
        shutdown('unhandledRejection');
    });
    process.on('uncaughtException', err => {
        logger.error('Uncaught Exception: ', err);
        shutdown('uncaughtException');
    });
};

start().catch(err => {
    logger.error('Failed to start:', err);
    process.exit(1);
});
