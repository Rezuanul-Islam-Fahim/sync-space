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
        this.connection = null;
        this.isListenersAttached = false;
    }

    /**
     * Attaches event listeners to connection instance.
     */
    attachListeners() {
        if (!this.connection || this.isListenersAttached) return;

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
     * Closes the database connection.
     */
    async disconnect() {
        if (this.connection && this.connection.readyState !== 0) {
            await this.connection.close();
        }
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
     */
    reset() {
        this.isListenersAttached = false;
        if (this.connection) {
            this.connection.removeAllListeners();
        }
        this.connection = null;
    }
}
