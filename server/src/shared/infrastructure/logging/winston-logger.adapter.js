import winston from 'winston';
import path from 'path';
import { AppLoggerPort } from '../../ports/index.js';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(info => {
        const reqIdStr = info.requestId ? ` [reqId: ${info.requestId}]` : '';
        return `${info.timestamp} (${info.level})${reqIdStr} ${info.message}`;
    })
);

const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

export class WinstonLoggerAdapter extends AppLoggerPort {
    constructor({ logLevel, logDir } = {}) {
        super();

        const resolvedLogLevel = logLevel || 'debug';
        const resolvedLogDir = logDir || path.join(process.cwd(), 'logs');

        this._logger = winston.createLogger({
            level: resolvedLogLevel,
            levels,
            transports: [
                new winston.transports.Console({
                    format: consoleFormat,
                }),
                new winston.transports.File({
                    filename: path.join(resolvedLogDir, 'error.log'),
                    level: 'error',
                    format: fileFormat,
                }),
                new winston.transports.File({
                    filename: path.join(resolvedLogDir, 'combined.log'),
                    format: fileFormat,
                }),
            ],
        });
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

    get stream() {
        return {
            write: message => {
                this.http(message.trim());
            },
        };
    }

    /**
     * Flushes buffered log entries to underlying transports during graceful shutdown.
     *
     * @param {number} [timeoutMs=2000] - Maximum fallback wait time in milliseconds
     * @returns {Promise<void>}
     */
    async flush(timeoutMs = 2000) {
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

/**
 * Pre-config bootstrap logger — intentionally reads LOG_LEVEL directly from
 * process.env BEFORE Joi validation runs.
 *
 * PURPOSE: Used ONLY for the `start().catch()` boundary in server.js (where
 * the application logger created from validated config.logLevel hasn't been
 * instantiated yet) and standalone CLI scripts (e.g. database seeders).
 *
 * DO NOT import this singleton in any application domain or feature module.
 * Instead, inject the validated logger through the DI system (composition root)
 * to maintain testability and ensure a consistent logger instance throughout the
 * application.
 */
export const logger = new WinstonLoggerAdapter({
    logLevel: process.env.LOG_LEVEL,
});
