import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined.');
}

let databaseName;
try {
    const url = new URL(mongoUri.replace(/^mongodb(\+srv)?:\/\//, 'http://'));
    const pathname = url.pathname.replace(/^\//, '').split('?')[0];
    if (pathname && !pathname.includes(':')) {
        databaseName = decodeURIComponent(pathname);
    }
} catch {
    const rawPath = mongoUri
        .substring(mongoUri.lastIndexOf('/') + 1)
        .split('?')[0];
    if (rawPath && !rawPath.includes(':')) {
        databaseName = decodeURIComponent(rawPath);
    }
}

if (!databaseName) {
    databaseName = process.env.DB_NAME || 'syncSpace';
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
