import dotenv from 'dotenv';
import {
    DatabaseConnectionAdapter,
    WinstonLoggerAdapter,
    bootstrapLogger,
} from '../shared/infrastructure/index.js';
import { getConfig } from '../config/index.js';
import { composeDependencies } from './composition-root.js';

dotenv.config();

const start = async () => {
    const config = getConfig();
    const PORT = config.port;

    // Create the application logger from the Joi-validated config value so that
    // LOG_LEVEL defaults and coercions are applied before the logger is used.
    // bootstrapLogger (module-level singleton) is reserved
    // solely for the outer start().catch() boundary below.
    const logger = new WinstonLoggerAdapter({ logLevel: config.logLevel });

    const dbConnection = new DatabaseConnectionAdapter({
        logger,
        dbConfig: config.db,
    });

    const connection = await dbConnection.connect();

    const app = composeDependencies({ logger, config, connection });

    const server = app.listen(PORT, () => {
        logger.info(`Server started on port: ${PORT}`);
    });

    let isShuttingDown = false;

    const shutdown = (signal, exitCode = 0) => {
        if (isShuttingDown) return;
        isShuttingDown = true;

        logger.info(`\n'${signal}' received. Shutting down gracefully...`);

        // Stop accepting new connections
        server.close(async () => {
            try {
                await dbConnection.disconnect();
                await logger.flush?.();
                process.exit(exitCode);
            } catch (err) {
                logger.error('Error during shutdown:', err);
                await logger.flush?.();
                process.exit(1);
            }
        });

        // Close idle HTTP keep-alive connections so server.close() doesn't hang
        if (typeof server.closeIdleConnections === 'function') {
            server.closeIdleConnections();
        }

        const forceTimeout = setTimeout(async () => {
            logger.error('Forced shutdown due to timeout.');
            if (typeof server.closeAllConnections === 'function') {
                server.closeAllConnections();
            }
            await logger.flush?.();
            process.exit(1);
        }, 10000);

        if (typeof forceTimeout.unref === 'function') {
            forceTimeout.unref();
        }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM', 0));
    process.on('SIGINT', () => shutdown('SIGINT', 0));
    process.on('unhandledRejection', reason => {
        logger.error('Unhandled Rejection:', reason);
        shutdown('unhandledRejection', 1);
    });
    process.on('uncaughtException', err => {
        logger.error('Uncaught Exception:', err);
        shutdown('uncaughtException', 1);
    });
};

start().catch(async err => {
    // bootstrapLogger is the pre-config singleton — the only safe logger
    // available if start() itself fails before the validated logger is created.
    bootstrapLogger.error('Failed to start:', err);
    await bootstrapLogger.flush?.();
    process.exit(1);
});
