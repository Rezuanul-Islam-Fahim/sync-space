import logger from '../../../utils/logger.js';
import { closeDB, initDB } from '../connection.js';
import { User } from '../../../modules/user/index.js';
import { getSeedUsers } from './user.seed.js';
import config from '../../../config/index.js';

const runSeeder = async () => {
    try {
        if (config.env === 'production') {
            logger.error(
                'CRITICAL: Seeding aborted! Database seeding is not permitted in production environment.'
            );
            process.exit(1);
        }

        logger.info('Starting database seeding...');

        await initDB();

        logger.info('Clearing existing users...');
        await User.deleteMany({});

        const seedUsers = await getSeedUsers();
        logger.info(`Inserting ${seedUsers.length} seed users...`);
        await User.insertMany(seedUsers);

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
