export class LoggerPort {
    info(_message, _meta) {
        throw new Error('LoggerPort: method info must be implemented');
    }

    warn(_message, _meta) {
        throw new Error('LoggerPort: method warn must be implemented');
    }

    error(_message, _meta) {
        throw new Error('LoggerPort: method error must be implemented');
    }

    http(_message, _meta) {
        throw new Error('LoggerPort: method http must be implemented');
    }

    debug(_message, _meta) {
        throw new Error('LoggerPort: method debug must be implemented');
    }

    get stream() {
        throw new Error('LoggerPort: getter stream must be implemented');
    }
}
