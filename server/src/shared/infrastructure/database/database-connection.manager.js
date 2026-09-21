import mongoose from 'mongoose';

export class DatabaseConnectionManager {
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
        this.connection = null;
        this.isListenersAttached = false;
        this.onConnected = () => {
            this.logger?.info('Mongoose connected to DB.');
        };
        this.onError = err => {
            this.logger?.error('Mongoose connection error:', err);
        };
        this.onDisconnected = () => {
            this.logger?.warn('Mongoose disconnected.');
        };
    }

    /**
     * Attaches event listeners to connection instance.
     *
     * @returns {void}
     */
    attachListeners() {
        if (!this.connection || this.isListenersAttached) return;

        this.connection.on('connected', this.onConnected);
        this.connection.on('error', this.onError);
        this.connection.on('disconnected', this.onDisconnected);

        this.isListenersAttached = true;
    }

    /**
     * Connects to MongoDB database using configuration.
     * Uses `mongoose.createConnection()` for scoped connection isolation (DI compliant).
     *
     * @returns {Promise<import('mongoose').Connection>}
     */
    async connect() {
        if (this.connection && this.connection.readyState === 1) {
            this.logger?.info?.('Mongoose is already connected.');
            return this.connection;
        }

        if (!this.connection) {
            this.connection = mongoose.createConnection(this.dbConfig.uri, {
                maxPoolSize: this.dbConfig.maxPoolSize,
                serverSelectionTimeoutMS:
                    this.dbConfig.serverSelectionTimeoutMS,
                socketTimeoutMS: this.dbConfig.socketTimeoutMS,
            });
            this.attachListeners();
        }

        await this.connection.asPromise();
        return this.connection;
    }

    /**
     * Closes the database connection and resets internal state.
     *
     * @returns {Promise<void>}
     */
    async disconnect() {
        if (this.connection && this.connection.readyState !== 0) {
            await this.connection.close();
        }
        this.reset();
    }

    /**
     * Returns the current connection instance.
     *
     * @returns {import('mongoose').Connection|null}
     */
    getConnection() {
        return this.connection;
    }

    /**
     * Resets listeners and connection state.
     *
     * @returns {void}
     */
    reset() {
        if (this.connection && this.isListenersAttached) {
            this.connection.removeListener('connected', this.onConnected);
            this.connection.removeListener('error', this.onError);
            this.connection.removeListener('disconnected', this.onDisconnected);
        }
        this.isListenersAttached = false;
        this.connection = null;
    }
}
