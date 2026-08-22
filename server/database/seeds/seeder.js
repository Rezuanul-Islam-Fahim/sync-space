import '../../src/bootstrap/env-loader.js';
import {
    bootstrapLogger as logger,
    DatabaseConnectionAdapter,
} from '../../src/shared/infrastructure/index.js';
import {
    composeAuthModule,
    getAuthUserModel,
} from '../../src/modules/auth/index.js';
import {
    composeUserModule,
    getUserModel,
} from '../../src/modules/user/index.js';
import { composeRegistrationModule } from '../../src/orchestration/registration/index.js';
import { getSeedUsers } from './user.seed.js';
import { getConfig } from '../../src/config/index.js';

/**
 * Connects to the database and seeds initial non-production user data.
 *
 * @returns {Promise<void>}
 */
const runSeeder = async () => {
    const config = getConfig();
    const dbConnection = new DatabaseConnectionAdapter({
        logger,
        dbConfig: config.db,
    });

    try {
        if (config.env === 'production') {
            logger.error(
                'CRITICAL: Seeding aborted! Database seeding is not permitted in production environment.'
            );
            process.exit(1);
        }

        logger.info('Starting database seeding...');

        const connection = await dbConnection.connect();

        const authUserModel = getAuthUserModel(connection);
        const userModel = getUserModel(connection);

        logger.info('Clearing existing credentials and user profiles...');
        await authUserModel.deleteMany({});
        await userModel.deleteMany({});

        const userModule = composeUserModule({
            logger,
            dbConnection: connection,
            userModel,
        });
        const authModule = composeAuthModule({
            logger,
            authConfig: config.auth,
            jwtConfig: config.jwt,
            dbConnection: connection,
            authUserModel,
        });
        const registrationModule = composeRegistrationModule({
            authService: authModule.authService,
            userService: userModule.userService,
            logger,
        });

        const registerUserProfileUseCase =
            registrationModule.registerUserProfileUseCase;

        const seedUsers = await getSeedUsers();
        logger.info(
            `Inserting ${seedUsers.length} seed users via registration orchestration...`
        );

        for (const userData of seedUsers) {
            await registerUserProfileUseCase.execute(userData);
        }

        logger.info('Database seeded successfully!');
    } catch (err) {
        logger.error('Error seeding database:', err);
        process.exitCode = 1;
    } finally {
        await dbConnection.disconnect();
        logger.info('DB connection closed.');
        await logger.flush?.();
    }
};

runSeeder();
