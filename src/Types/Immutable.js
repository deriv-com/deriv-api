/**
 * An abstract class for immutable objects
 */
export default class Immutable {
    constructor() {
        /**
         * The main storage for the data in immutable objects
         *
         * Any access should be done through getters and streams
         */
        this._data = {};
    }

    freeze() {
        Object.freeze(this);
    }
}
