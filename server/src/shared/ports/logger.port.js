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
     * @returns {{ write: (message: string) => void }}
     */
    get stream() {
        throw new Error('LoggerPort: getter stream must be implemented');
    }

    /**
     * Flushes buffered log entries to underlying transports.
     *
     * @returns {Promise<void>}
     */
    async flush() {
        throw new Error('LoggerPort: method flush must be implemented');
    }
}
