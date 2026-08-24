import { createClient } from 'redis';

export class RedisConnectionAdapter {
    constructor({ logger, redisUrl }) {
        this.logger = logger;
        this.redisUrl = redisUrl;
        this.redisClient = null;
        this.isListenersAttached = false;
        this.onError = err => {
            this.logger?.error('Redis client error:', err);
        };
        this.onConnect = () => {
            this.logger?.info('Redis client connected.');
        };
        this.onReconnecting = () => {
            this.logger?.warn('Redis client reconnecting...');
        };
        this.onReady = () => {
            this.logger?.info('Redis client ready for commands.');
        };
    }

    attachListeners() {
        if (!this.redisClient || this.isListenersAttached) return;

        this.redisClient.on('error', this.onError);
        this.redisClient.on('connect', this.onConnect);
        this.redisClient.on('reconnecting', this.onReconnecting);
        this.redisClient.on('ready', this.onReady);
        this.isListenersAttached = true;
    }

    async connect() {
        if (this.redisClient && this.redisClient.isOpen) {
            this.logger?.info('Redis client is already connected!');
            return this.redisClient;
        }

        if (!this.redisClient) {
            this.redisClient = createClient({ url: this.redisUrl });
            this.attachListeners();
        }

        await this.redisClient.connect();

        return this.redisClient;
    }

    getConnection() {
        return this.redisClient;
    }

    async disconnect() {
        try {
            if (this.redisClient && this.redisClient.isOpen) {
                await this.redisClient.close();
            }
        } catch (err) {
            this.logger?.error('Error while quitting Redis:', err);

            try {
                this.redisClient?.destroy?.();
            } catch (destroyErr) {
                this.logger?.error('Error while destroying Redis:', destroyErr);
            }
        } finally {
            this.reset();
        }
    }

    reset() {
        if (this.redisClient && this.isListenersAttached) {
            this.redisClient.removeListener('error', this.onError);
            this.redisClient.removeListener('connect', this.onConnect);
            this.redisClient.removeListener(
                'reconnecting',
                this.onReconnecting
            );
            this.redisClient.removeListener('ready', this.onReady);
            this.isListenersAttached = false;
        }
        this.redisClient = null;
    }
}
