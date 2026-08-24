import { createClient } from 'redis';

export class RedisCacheAdapter {
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
    }

    attachListeners() {
        if (!this.redisClient || this.isListenersAttached) return;

        this.redisClient.on('error', this.onError);
        this.redisClient.on('connect', this.onConnect);
        this.redisClient.on('reconnecting', this.onReconnecting);
        this.isListenersAttached = true;
    }

    async connect() {
        if (this.redisClient && this.redisClient.isReady) {
            this.logger?.info('Redis client is already connected!');
            return this.redisClient;
        }

        this.redisClient = createClient({ url: this.redisUrl });
        this.attachListeners();

        await this.redisClient.connect();

        return this.redisClient;
    }

    getConnection() {
        return this.redisClient;
    }

    async disconnect() {
        if (this.redisClient && this.redisClient.isOpen) {
            await this.redisClient.quit();
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
            this.isListenersAttached = false;
            this.redisClient = null;
        }
    }
}
