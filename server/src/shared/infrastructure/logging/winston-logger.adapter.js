import { LoggerPort } from '../../ports/index.js';

/**
 * Adapter implementing LoggerPort by delegating to an injected Winston logger instance.
 */
export class WinstonLoggerAdapter extends LoggerPort {
    /**
     * @param {{ logger: import('winston').Logger }} deps
     */
    constructor({ logger }) {
        super();

        if (!logger) {
            throw new Error(
                'WinstonLoggerAdapter requires a configured winston.Logger instance.'
            );
        }

        this._logger = logger;
    }

    info(message, meta) {
        this._logger.info(message, meta);
    }

    warn(message, meta) {
        this._logger.warn(message, meta);
    }

    error(message, meta) {
        this._logger.error(message, meta);
    }

    http(message, meta) {
        this._logger.http(message, meta);
    }

    debug(message, meta) {
        this._logger.debug(message, meta);
    }

    /**
     * Flushes buffered log entries to underlying transports during graceful shutdown.
     *
     * @param {number} [timeoutMs=2000] - Maximum fallback wait time in milliseconds
     * @returns {Promise<void>}
     */
    async flush(timeoutMs = 2000) {
        if (this._logger.destroyed || this._logger.writableEnded) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            let timerId = null;

            const cleanup = () => {
                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
                this._logger.removeListener('finish', onFinish);
                this._logger.removeListener('error', onError);
            };

            const onFinish = () => {
                cleanup();
                resolve();
            };

            const onError = () => {
                cleanup();
                resolve();
            };

            this._logger.once('finish', onFinish);
            this._logger.once('error', onError);

            timerId = setTimeout(() => {
                cleanup();
                resolve();
            }, timeoutMs);

            if (timerId && typeof timerId.unref === 'function') {
                timerId.unref();
            }

            this._logger.end();
        });
    }
}
