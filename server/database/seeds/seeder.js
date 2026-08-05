import {
    bootstrapLogger as logger,
    DatabaseConnectionAdapter,
} from '../../src/shared/infrastructure/index.js';
import { getAuthUserModel } from '../../src/modules/auth/infrastructure/database/auth-user.model.js';
import { getUserModel } from '../../src/modules/user/infrastructure/database/user.model.js';
import { composeAuthModule } from '../../src/modules/auth/index.js';
import { composeUserModule } from '../../src/modules/user/index.js';
import { composeRegistrationModule } from '../../src/orchestration/registration/index.js';
import { getSeedUsers } from './user.seed.js';
import { getConfig } from '../../src/config/index.js';

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

        const userModule = composeUserModule({ logger, connection, userModel });
        const authModule = composeAuthModule({
            logger,
            authConfig: config.auth,
            jwtConfig: config.jwt,
            connection,
            authUserModel,
        });
        const registrationModule = composeRegistrationModule({
            authService: authModule.authService,
            userService: userModule.userService,
            logger,
        });

        const registrationService = registrationModule.registrationService;

        const seedUsers = await getSeedUsers();
        logger.info(
            `Inserting ${seedUsers.length} seed users via registration orchestration...`
        );

        for (const userData of seedUsers) {
            await registrationService.registerUser(userData);
        }

        logger.info('Database seeded successfully!');
    } catch (err) {
        logger.error('Error seeding database:', err);
        process.exit(1);
    } finally {
        await dbConnection.disconnect();
        logger.info('DB connection closed.');
        process.exit(0);
    }
};

runSeeder();
