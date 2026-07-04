import createApp from './app.js';
import { initDB, closeDB } from './infrastructure/database/connection.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import { AuthController, makeAuthUseCases } from './modules/auth/index.js';
import { UserRepository, User } from './modules/user/index.js';
import makeRoutes from './routes/index.js';
import { makeAuthenticate } from './middlewares/auth.middleware.js';

const PORT = config.port;

const createContainer = () => {
    const userRepository = new UserRepository(User);
    const { loginUserUseCase, registerUserUseCase } = makeAuthUseCases({
        userRepository,
    });
    const authController = new AuthController({
        loginUserUseCase,
        registerUserUseCase,
    });
    const authenticate = makeAuthenticate(userRepository);

    return { authController, authenticate };
};

const start = async () => {
    await initDB();

    const container = createContainer();
    const router = makeRoutes(container);
    const app = createApp({ router });

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
