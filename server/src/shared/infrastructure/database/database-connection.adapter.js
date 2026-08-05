import mongoose from 'mongoose';

export class DatabaseConnectionAdapter {
    /**
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
    constructor({ logger, dbConfig }) {
        this.logger = logger;
        this.dbConfig = dbConfig;
        this.connection = mongoose.connection;
        this.isListenersAttached = false;
    }

    /**
     * Attaches event listeners to connection instance.
     */
    attachListeners() {
        if (this.isListenersAttached) return;

        this.connection.on('connected', () => {
            this.logger?.info?.('Mongoose connected to DB.');
        });

        this.connection.on('error', err => {
            this.logger?.error?.('Mongoose connection error:', err);
        });

        this.connection.on('disconnected', () => {
            this.logger?.warn?.('Mongoose disconnected.');
        });

        this.isListenersAttached = true;
    }

    /**
     * Connects to MongoDB database using configuration.
     *
     * @returns {Promise<import('mongoose').Connection>}
     */
    async connect() {
        if (this.connection.readyState === 1) {
            this.logger?.info?.('Mongoose is already connected.');
            return this.connection;
        }

        this.attachListeners();

        await mongoose.connect(this.dbConfig.uri, {
            maxPoolSize: this.dbConfig.maxPoolSize,
            serverSelectionTimeoutMS: this.dbConfig.serverSelectionTimeoutMS,
            socketTimeoutMS: this.dbConfig.socketTimeoutMS,
        });

        return this.connection;
    }

    /**
     * Closes the database connection.
     */
    async disconnect() {
        if (this.connection.readyState !== 0) {
            await this.connection.close();
        }
    }

    /**
     * Resets listeners and connection state.
     */
    reset() {
        this.isListenersAttached = false;
        this.connection.removeAllListeners();
    }
}
