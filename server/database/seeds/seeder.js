import {
    logger,
    DatabaseConnectionAdapter,
} from '../../src/shared/infrastructure/index.js';
import { UserModel } from '../../src/modules/user/infrastructure/database/user.model.js';
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

        await dbConnection.connect();

        logger.info('Clearing existing users...');
        await UserModel.deleteMany({});

        const seedUsers = await getSeedUsers();
        logger.info(`Inserting ${seedUsers.length} seed users...`);
        await UserModel.insertMany(seedUsers);

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
