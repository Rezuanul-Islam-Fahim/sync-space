/**
 * Base Logger Port — Defines core application logging contract.
 * Focuses purely on logging messages at various severity levels (ISP).
 */
export class LoggerPort {
    /**
     * @param {string} _message
     * @param {object} [_meta]
     * @returns {void}
     */
    info(_message, _meta) {
        throw new Error('LoggerPort: method info must be implemented');
    }

    /**
     * @param {string} _message
     * @param {object} [_meta]
     * @returns {void}
     */
    warn(_message, _meta) {
        throw new Error('LoggerPort: method warn must be implemented');
    }

    /**
     * @param {string} _message
     * @param {object} [_meta]
     * @returns {void}
     */
    error(_message, _meta) {
        throw new Error('LoggerPort: method error must be implemented');
    }

    /**
     * @param {string} _message
     * @param {object} [_meta]
     * @returns {void}
     */
    http(_message, _meta) {
        throw new Error('LoggerPort: method http must be implemented');
    }

    /**
     * @param {string} _message
     * @param {object} [_meta]
     * @returns {void}
     */
    debug(_message, _meta) {
        throw new Error('LoggerPort: method debug must be implemented');
    }
}

/**
 * Streamable Logger Port — For loggers providing an HTTP middleware stream interface.
 */
export class StreamableLoggerPort extends LoggerPort {
    /**
     * @returns {{ write: (message: string) => void }}
     */
    get stream() {
        throw new Error(
            'StreamableLoggerPort: getter stream must be implemented'
        );
    }
}

/**
 * Flushable Logger Port — For loggers supporting async buffer flushing during shutdown.
 */
export class FlushableLoggerPort extends LoggerPort {
    /**
     * Flushes buffered log entries to underlying transports.
     *
     * @returns {Promise<void>}
     */
    async flush() {
        throw new Error(
            'FlushableLoggerPort: method flush must be implemented'
        );
    }
}

/**
 * Full Application Logger Port — Combines logging, streaming, and flushing capabilities.
 */
export class AppLoggerPort extends LoggerPort {
    /**
     * @returns {{ write: (message: string) => void }}
     */
    get stream() {
        throw new Error('AppLoggerPort: getter stream must be implemented');
    }

    /**
     * Flushes buffered log entries to underlying transports.
     *
     * @returns {Promise<void>}
     */
    async flush() {
        throw new Error('AppLoggerPort: method flush must be implemented');
    }
}
