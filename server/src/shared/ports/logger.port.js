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

    /**
     * Flushes buffered log entries to underlying transports during shutdown.
     * Default implementation is a no-op for loggers that do not buffer output.
     *
     * @param {number} [_timeoutMs]
     * @returns {Promise<void>}
     */
    async flush(_timeoutMs) {
        return Promise.resolve();
    }
}
