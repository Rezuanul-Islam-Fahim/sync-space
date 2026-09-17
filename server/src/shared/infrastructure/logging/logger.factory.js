import winston from 'winston';
import path from 'node:path';
import { WinstonLoggerAdapter } from './winston-logger.adapter.js';

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

/**
 * Creates a WinstonLoggerAdapter configured for application runtime.
 *
 * @param {{
 *   logLevel?: string,
 *   logDir?: string,
 *   enableFileLogging?: boolean,
 *   silent?: boolean
 * }} [options]
 * @returns {WinstonLoggerAdapter}
 */
export const createApplicationLogger = ({
    logLevel = 'debug',
    logDir = path.join(process.cwd(), 'logs'),
    enableFileLogging = false,
    silent = false,
} = {}) => {
    const transports = [
        new winston.transports.Console({
            format: consoleFormat,
            silent,
        }),
    ];

    if (enableFileLogging) {
        transports.push(
            new winston.transports.File({
                filename: path.join(logDir, 'error.log'),
                level: 'error',
                format: fileFormat,
            }),
            new winston.transports.File({
                filename: path.join(logDir, 'combined.log'),
                format: fileFormat,
            })
        );
    }

    const winstonInstance = winston.createLogger({
        level: logLevel,
        levels,
        transports,
    });

    return new WinstonLoggerAdapter({ logger: winstonInstance });
};

/**
 * Lightweight Console-only logger for pre-config bootstrapping.
 * Never writes to disk and produces zero side effects on import.
 *
 * @param {string} [logLevel]
 * @returns {WinstonLoggerAdapter}
 */
export const createBootstrapLogger = (
    logLevel = process.env.LOG_LEVEL || 'info'
) => {
    const winstonInstance = winston.createLogger({
        level: logLevel,
        levels,
        transports: [
            new winston.transports.Console({
                format: consoleFormat,
            }),
        ],
    });

    return new WinstonLoggerAdapter({ logger: winstonInstance });
};

/**
 * Pre-config bootstrap logger singleton for unhandled startup/CLI boundaries.
 * Console-only, safe, and does not create file handles on disk.
 */
export const bootstrapLogger = createBootstrapLogger();
