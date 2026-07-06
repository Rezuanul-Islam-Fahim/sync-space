export class DuplicateFieldError extends Error {
    constructor(field) {
        super(`Duplicate value for field: ${field}`);
        this.name = 'DuplicateFieldError';
        this.field = field;
    }
}
