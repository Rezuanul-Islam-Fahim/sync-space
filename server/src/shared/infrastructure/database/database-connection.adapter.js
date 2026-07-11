import mongoose from 'mongoose';

export const initDB = async ({ logger, dbConfig }) => {
    mongoose.connection.on('connected', () => {
        logger.info('Mongoose connected to DB.');
    });

    mongoose.connection.on('error', err => {
        logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('Mongoose disconnected.');
    });

    await mongoose.connect(dbConfig.uri, {
        maxPoolSize: dbConfig.maxPoolSize,
        serverSelectionTimeoutMS: dbConfig.serverSelectionTimeoutMS,
        socketTimeoutMS: dbConfig.socketTimeoutMS,
    });
};


export const closeDB = async () => {
    await mongoose.connection.close();
};
