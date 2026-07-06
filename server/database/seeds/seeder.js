import { logger } from '../../src/shared/infrastructure/logging/winston-logger.adapter.js';
import {
    closeDB,
    initDB,
} from '../../src/shared/infrastructure/database/index.js';
import { UserModel } from '../../src/modules/user/infrastructure/database/user.model.js';
import { getSeedUsers } from './user.seed.js';
import { isDev } from '../../src/config/index.js';

const runSeeder = async () => {
    try {
        if (!isDev()) {
            logger.error(
                'CRITICAL: Seeding aborted! Database seeding is not permitted in production environment.'
            );
            process.exit(1);
        }

        logger.info('Starting database seeding...');

        await initDB({ logger });

        logger.info('Clearing existing users...');
        await UserModel.deleteMany({});

        const seedUsers = await getSeedUsers();
        logger.info(`Inserting ${seedUsers.length} seed users...`);
        await UserModel.insertMany(seedUsers);

        logger.info('Database seeded successfully!');
    } catch (err) {
        logger.error('Error seeding database: ', err);
        process.exit(1);
    } finally {
        await closeDB();
        logger.info('DB connection closed.');
        process.exit(0);
    }
};

runSeeder();
