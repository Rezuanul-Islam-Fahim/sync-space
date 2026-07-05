export class ValueObject {
    constructor(props) {
        this.props = Object.freeze({ ...props });
    }

    equals(other) {
        if (other === null || other === undefined) {
            return false;
        }
        if (other.props === undefined) {
            return false;
        }
        return JSON.stringify(this.props) === JSON.stringify(other.props);
    }
}
