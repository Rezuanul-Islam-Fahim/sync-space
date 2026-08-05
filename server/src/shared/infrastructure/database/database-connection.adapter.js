import mongoose from 'mongoose';

let isListenersAttached = false;

/**
 * Attaches event listeners to Mongoose connection exactly once.
 *
 * @param {import('../../ports/index.js').LoggerPort} logger
 */
const attachConnectionListeners = logger => {
    if (isListenersAttached) return;

    mongoose.connection.on('connected', () => {
        logger?.info?.('Mongoose connected to DB.');
    });

    mongoose.connection.on('error', err => {
        logger?.error?.('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        logger?.warn?.('Mongoose disconnected.');
    });

    isListenersAttached = true;
};

/**
 * Initializes MongoDB connection and attaches event listeners.
 *
 * @param {{
 *   logger: import('../../ports/index.js').LoggerPort,
 *   dbConfig: {
 *     uri: string,
 *     maxPoolSize?: number,
 *     serverSelectionTimeoutMS?: number,
 *     socketTimeoutMS?: number
 *   }
 * }} params
 */
export const initDB = async ({ logger, dbConfig }) => {
    if (mongoose.connection.readyState === 1) {
        logger?.info?.('Mongoose is already connected.');
        return;
    }

    attachConnectionListeners(logger);

    await mongoose.connect(dbConfig.uri, {
        maxPoolSize: dbConfig.maxPoolSize,
        serverSelectionTimeoutMS: dbConfig.serverSelectionTimeoutMS,
        socketTimeoutMS: dbConfig.socketTimeoutMS,
    });
};

/**
 * Closes the active MongoDB connection.
 */
export const closeDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
};

/**
 * Resets database listener state and removes connection listeners.
 * Useful for test suite isolation.
 */
export const resetDBConnection = () => {
    isListenersAttached = false;
    mongoose.connection.removeAllListeners();
};
