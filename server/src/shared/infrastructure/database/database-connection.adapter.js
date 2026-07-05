import mongoose from 'mongoose';
import config from '../../../config/index.js';

export const initDB = async ({ logger }) => {
    mongoose.connection.on('connected', () => {
        logger.info('Mongoose connected to DB.');
    });

    mongoose.connection.on('error', err => {
        logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('Mongoose disconnected.');
    });

    await mongoose.connect(config.db.uri, {
        maxPoolSize: config.db.maxPoolSize,
        serverSelectionTimeoutMS: config.db.serverSelectionTimeoutMS,
        socketTimeoutMS: config.db.socketTimeoutMS,
    });
};

export const closeDB = async () => {
    await mongoose.connection.close();
};
