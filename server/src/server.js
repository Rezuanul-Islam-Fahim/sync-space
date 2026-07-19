import {
    initDB,
    closeDB,
    WinstonLoggerAdapter,
    logger as bootstrapLogger,
} from './shared/infrastructure/index.js';
import { config } from './config/index.js';
import { composeDependencies } from './composition-root.js';

const start = async () => {
    const PORT = config.port;

    // Create the application logger from the Joi-validated config value so that
    // LOG_LEVEL defaults and coercions are applied before the logger is used.
    // bootstrapLogger (module-level singleton) is reserved
    // solely for the outer start().catch() boundary below.
    const logger = new WinstonLoggerAdapter({ logLevel: config.logLevel });

    await initDB({ logger, dbConfig: config.db });

    const app = composeDependencies({ logger });

    const server = app.listen(PORT, () => {
        logger.info(`Server started on port: ${PORT}`);
    });

    const shutdown = (signal, exitCode = 0) => {
        logger.info(`\n'${signal}' received. Shutting down gracefully...`);

        // Stop accepting new connections
        server.close(async () => {
            try {
                await closeDB();
                process.exit(exitCode);
            } catch (err) {
                logger.error('Error during shutdown: ', err);
                process.exit(1);
            }
        });

        setTimeout(() => {
            logger.error('Forced shutdown due to timeout.');
            process.exit(1);
        }, 30000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM', 0));
    process.on('SIGINT', () => shutdown('SIGINT', 0));
    process.on('unhandledRejection', reason => {
        logger.error('Unhandled Rejection: ', reason);
        shutdown('unhandledRejection', 1);
    });
    process.on('uncaughtException', err => {
        logger.error('Uncaught Exception: ', err);
        shutdown('uncaughtException', 1);
    });
    process.on('criticalError', err => {
        logger.error('Critical non-operational error: ', err);
        shutdown('criticalError', 1);
    });
};

start().catch(err => {
    // bootstrapLogger is the pre-config singleton — the only safe logger
    // available if start() itself fails before the validated logger is created.
    bootstrapLogger.error('Failed to start: ', err);
    process.exit(1);
});
