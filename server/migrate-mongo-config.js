import { config } from './src/config/index.js';

const migrateMongoConfig = {
    mongodb: {
        url: config.db.uri,
        databaseName: config.db.uri
            .substring(config.db.uri.lastIndexOf('/') + 1)
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
