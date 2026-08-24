import './env-loader.js';
import {
    DatabaseConnectionAdapter,
    RedisCacheAdapter,
    WinstonLoggerAdapter,
    bootstrapLogger,
} from '../shared/infrastructure/index.js';
import { getConfig } from '../config/index.js';
import { composeDependencies } from './composition-root.js';

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

    const redisClient = new RedisCacheAdapter({
        logger,
        redisUrl: config.redis.uri,
    });

    await redisClient.connect();

    const app = composeDependencies({ logger, config, connection });

    let isShuttingDown = false;
    let forceTimeout = null;
    let server = null;

    const shutdown = async (signal, exitCode = 0) => {
        if (isShuttingDown) return;
        isShuttingDown = true;

        logger.info(`'${signal}' received. Shutting down gracefully...`);

        // Hard timeout limit: forcefully terminate process if graceful shutdown takes longer than 10 seconds
        forceTimeout = setTimeout(async () => {
            try {
                logger.error(
                    'Graceful shutdown timed out (10s). Forcing termination.'
                );
                if (typeof server?.closeAllConnections === 'function') {
                    server.closeAllConnections();
                }
                await dbConnection.disconnect();
                await logger.flush?.();
            } catch (err) {
                logger.error('Error during forced shutdown:', err);
                await logger.flush?.();
            } finally {
                process.exit(1);
            }
        }, 10000);
        forceTimeout.unref();

        try {
            // Close idle HTTP keep-alive connections
            if (typeof server?.closeIdleConnections === 'function') {
                server.closeIdleConnections();
            }

            // Stop accepting new HTTP requests
            if (server && server.listening) {
                await new Promise(resolve => server.close(resolve));
                logger.info('HTTP server closed.');
            }

            // Disconnect from database
            await dbConnection.disconnect();
            logger.info('Database connection closed.');

            await logger.flush?.();

            if (forceTimeout) clearTimeout(forceTimeout);
            process.exit(exitCode);
        } catch (err) {
            logger.error('Error during graceful shutdown:', err);
            if (forceTimeout) clearTimeout(forceTimeout);
            await logger.flush?.();
            process.exit(1);
        }
    };

    server = app.listen(PORT, () => {
        logger.info(`Server started on port: ${PORT}`);
    });

    server.on('error', err => {
        logger.error('HTTP server encountered an error:', err);
        shutdown('SERVER_ERROR', 1);
    });

    process.on('SIGTERM', () => shutdown('SIGTERM', 0));
    process.on('SIGINT', () => shutdown('SIGINT', 0));

    process.on('unhandledRejection', reason => {
        logger.error('Unhandled Rejection:', reason);
        shutdown('unhandledRejection', 1);
    });

    process.on('uncaughtException', async err => {
        try {
            logger.error(
                'Uncaught Exception — immediately exiting process:',
                err
            );
            if (server && server.listening) {
                server.close();
            }
            await logger.flush?.(1000);
        } catch {
            // Ensure process termination even if logging fails
        } finally {
            process.exit(1);
        }
    });
};

start().catch(async err => {
    // bootstrapLogger is the pre-config singleton — the only safe logger
    // available if start() itself fails before the validated logger is created.
    bootstrapLogger.error('Failed to start:', err);
    await bootstrapLogger.flush?.();
    process.exit(1);
});
