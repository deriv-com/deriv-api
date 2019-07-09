/**
 * An abstract class for immutable objects
 *
 * @param {Object} props - A list of properties to add for the immutable object
 */
export default class Immutable {
    constructor(props = {}) {
        Object.keys(props).forEach((p) => { this[p] = props[p]; });
        /**
         * The main storage for the data in immutable objects
         *
         * Any access should be done through getters and streams
         */
        this._data = {};

        // Don't allow any other change, every other property can be added to _data
        return Object.freeze(this);
    }
}
