import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined.');
}

const migrateMongoConfig = {
    mongodb: {
        url: mongoUri,
        databaseName: mongoUri
            .substring(mongoUri.lastIndexOf('/') + 1)
            .split('?')[0],
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    migrationsDir: 'database/migrations',
    changelogCollectionName: 'changelog',
    migrationFileExtension: '.js',
    useFileHash: false,
    moduleSystem: 'esm',
};

export default migrateMongoConfig;
