import mongoose from 'mongoose';
import config from '../../config/index.js';
import logger from '../logger/logger.js';

const mongooseOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

export const initDB = async () => {
    mongoose.connection.on('connected', () => {
        logger.info('Mongoose connected to DB.');
    });

    mongoose.connection.on('error', err => {
        logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('Mongoose disconnected.');
    });

    await mongoose.connect(config.db.uri, mongooseOptions);
};

export const closeDB = async () => {
    await mongoose.connection.close();
};
