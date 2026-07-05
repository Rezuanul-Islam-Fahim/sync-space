export class Entity {
    #id;

    constructor(id) {
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    equals(other) {
        if (other === null || other === undefined) {
            return false;
        }
        if (!(other instanceof Entity)) {
            return false;
        }
        return this.#id === other.id;
    }
}
