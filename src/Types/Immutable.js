/**
 * An abstract class for immutable objects
 */
export default class Immutable {
    constructor() {
        return Object.freeze(this);
    }
}
