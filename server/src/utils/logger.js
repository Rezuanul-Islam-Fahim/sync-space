import winston from 'winston'
import config from '../common/config.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
}

winston.addColors(colors)

const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} (${info.level}) ${info.message}`
    )
)

const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
)

const logger = winston.createLogger({
    level: config.logLevel,
    levels,
    transports: [
        new winston.transports.Console({
            format: consoleFormat
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error',
            format: fileFormat
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/combined.log'),
            format: fileFormat
        })
    ]
})

logger.stream = {
    write: (message) => {
        logger.http(message.trim())
    }
}

export default logger 
