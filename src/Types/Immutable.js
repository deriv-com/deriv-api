/**
 * An abstract class for immutable objects
 */
export default class Immutable {
    freeze() {
        Object.freeze(this);
    }
}
