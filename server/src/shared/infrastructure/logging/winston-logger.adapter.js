import winston from 'winston';
import path from 'path';
import { LoggerPort } from '../../ports/logger.port.js';

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
    winston.format.printf(
        info => `${info.timestamp} (${info.level}) ${info.message}`
    )
);

const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

export class WinstonLoggerAdapter extends LoggerPort {
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
}

/**
 * Pre-config bootstrap logger — intentionally reads LOG_LEVEL directly from
 * process.env BEFORE Joi validation runs.
 *
 * PURPOSE: Used ONLY for the `start().catch()` boundary in server.js, where
 * the application logger (created from the validated config.logLevel) hasn't
 * been instantiated yet. If startup fails before config loads, this singleton
 * is the only logger available.
 *
 * DO NOT import this singleton in any application module or class. Instead,
 * inject the validated logger through the DI system (composition root) to
 * maintain testability and ensure a consistent logger instance throughout the
 * application.
 */
export const logger = new WinstonLoggerAdapter({
    logLevel: process.env.LOG_LEVEL,
});
