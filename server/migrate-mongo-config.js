import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined.');
}

let databaseName;
try {
    const url = new URL(mongoUri);
    databaseName = url.pathname.replace(/^\//, '').split('?')[0];
} catch {
    databaseName = mongoUri
        .substring(mongoUri.lastIndexOf('/') + 1)
        .split('?')[0];
}

if (!databaseName || databaseName.includes(':')) {
    databaseName = 'sync_space';
}

const migrateMongoConfig = {
    mongodb: {
        url: mongoUri,
        databaseName,
    },
    migrationsDir: 'database/migrations',
    changelogCollectionName: 'changelog',
    migrationFileExtension: '.js',
    useFileHash: false,
    moduleSystem: 'esm',
};

export default migrateMongoConfig;
