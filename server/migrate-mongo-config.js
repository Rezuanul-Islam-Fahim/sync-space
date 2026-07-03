import dotenv from 'dotenv';

dotenv.config();

const envVars = process.env;

const config = {
    mongodb: {
        url: envVars.MONGODB_URI,
        databaseName: envVars.MONGODB_URI.substring(
            envVars.MONGODB_URI.lastIndexOf('/') + 1
        ).split('?')[0],
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    migrationsDir: 'src/infrastructure/database/migrations',
    changelogCollectionName: 'changelog',
    migrationFileExtension: '.js',
    useFileHash: false,
    moduleSystem: 'esm',
};

export default config;
