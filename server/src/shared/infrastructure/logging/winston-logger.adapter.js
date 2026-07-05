import winston from 'winston';
import config from '../../../config/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoggerPort } from '../../ports/logger.port.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

class WinstonLoggerAdapter extends LoggerPort {
    constructor() {
        super();
        this._logger = winston.createLogger({
            level: config.logLevel,
            levels,
            transports: [
                new winston.transports.Console({
                    format: consoleFormat,
                }),
                new winston.transports.File({
                    filename: path.join(
                        __dirname,
                        '../../../../logs/error.log'
                    ),
                    level: 'error',
                    format: fileFormat,
                }),
                new winston.transports.File({
                    filename: path.join(
                        __dirname,
                        '../../../../logs/combined.log'
                    ),
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

const logger = new WinstonLoggerAdapter();
export default logger;
