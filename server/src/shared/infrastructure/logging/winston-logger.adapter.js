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
 * Module-level singleton instance of the WinstonLoggerAdapter.
 *
 * IMPORTANT: This singleton is intended primarily for bootstrapping tasks, such as initial database
 * connection setup, startup/shutdown hooks, and uncaught process level exceptions.
 * For general application modules and classes, do not import this instance directly. Instead,
 * inject it through the Dependency Injection (DI) system (e.g. from the composition root) to maintain
 * testability and ensure the same logger instance flows throughout the system.
 */
export const logger = new WinstonLoggerAdapter({
    logLevel: process.env.LOG_LEVEL,
});
